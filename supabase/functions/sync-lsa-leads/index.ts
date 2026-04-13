// Supabase Edge Function: sync-lsa-leads
// Polls Google Ads API v23 for LSA leads and writes to contact_submissions
//
// Deploy: cd law-site && npx supabase functions deploy sync-lsa-leads --no-verify-jwt
// Test:   curl -X POST https://gpckxhsiawummkkegeix.supabase.co/functions/v1/sync-lsa-leads

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const ADS_API = "https://googleads.googleapis.com/v23";
const LSA_ACCOUNT = "8068698325";

Deno.serve(async (_req) => {
  try {
    const developerToken = Deno.env.get("GOOGLE_ADS_DEVELOPER_TOKEN");
    const clientId = Deno.env.get("GOOGLE_LSA_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_LSA_CLIENT_SECRET");
    const refreshToken = Deno.env.get("GOOGLE_LSA_REFRESH_TOKEN");
    const managerId = Deno.env.get("GOOGLE_ADS_CUSTOMER_ID")?.replace(/-/g, "");

    if (!developerToken || !clientId || !clientSecret || !refreshToken || !managerId) {
      return json(400, { error: "Missing credentials" });
    }

    // Step 1: Get access token
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId, client_secret: clientSecret,
        refresh_token: refreshToken, grant_type: "refresh_token",
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return json(401, { error: "Token failed", details: tokenData });

    const headers = {
      "Authorization": `Bearer ${tokenData.access_token}`,
      "developer-token": developerToken,
      "login-customer-id": managerId,
      "Content-Type": "application/json",
    };

    // Step 2: Fetch LSA leads from last 7 days
    const leadRes = await fetch(`${ADS_API}/customers/${LSA_ACCOUNT}/googleAds:search`, {
      method: "POST", headers,
      body: JSON.stringify({
        query: `SELECT local_services_lead.id, local_services_lead.lead_type, local_services_lead.category_id, local_services_lead.service_id, local_services_lead.contact_details, local_services_lead.creation_date_time, local_services_lead.lead_charged FROM local_services_lead WHERE local_services_lead.creation_date_time DURING LAST_30_DAYS ORDER BY local_services_lead.creation_date_time DESC LIMIT 200`,
      }),
    });

    if (!leadRes.ok) {
      const errText = await leadRes.text();
      return json(leadRes.status, { error: "Lead query failed", body: errText.substring(0, 500) });
    }

    const leadData = await leadRes.json();
    const leads = leadData.results || [];

    // Step 3: Fetch conversations (call recordings + messages)
    let recordingMap: Record<string, string> = {};
    let messageMap: Record<string, string> = {};

    try {
      const convRes = await fetch(`${ADS_API}/customers/${LSA_ACCOUNT}/googleAds:search`, {
        method: "POST", headers,
        body: JSON.stringify({
          query: `SELECT local_services_lead_conversation.id, local_services_lead_conversation.lead, local_services_lead_conversation.conversation_channel, local_services_lead_conversation.participant_type, local_services_lead_conversation.phone_call_details.call_recording_url, local_services_lead_conversation.phone_call_details.call_duration_millis, local_services_lead_conversation.message_details.text, local_services_lead_conversation.event_date_time FROM local_services_lead_conversation WHERE local_services_lead_conversation.event_date_time DURING LAST_30_DAYS ORDER BY local_services_lead_conversation.event_date_time ASC LIMIT 500`,
        }),
      });

      if (convRes.ok) {
        const convData = await convRes.json();
        for (const row of (convData.results || [])) {
          const conv = row.localServicesLeadConversation;
          if (!conv) continue;
          const leadId = conv.lead?.split("/").pop();
          if (conv.phoneCallDetails?.callRecordingUrl) recordingMap[leadId] = conv.phoneCallDetails.callRecordingUrl;
          // Only capture CONSUMER messages (not advertiser replies)
          if (conv.messageDetails?.text && conv.participantType === "CONSUMER") {
            messageMap[leadId] = messageMap[leadId] ? messageMap[leadId] + "\n" + conv.messageDetails.text : conv.messageDetails.text;
          }
        }
      }
    } catch (e) { console.error("Conversation fetch error:", e); }

    // Step 4: Write to Supabase
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    let imported = 0, skipped = 0;
    const errors: string[] = [];

    for (const row of leads) {
      const lead = row.localServicesLead;
      if (!lead) continue;

      const leadId = String(lead.id);

      // Deduplicate
      const { data: existing, error: dedupErr } = await supabase.from("contact_submissions").select("id").eq("lsa_lead_id", leadId).maybeSingle();
      if (existing) { skipped++; continue; }

      const phone = lead.contactDetails?.phoneNumber || null;
      const email = lead.contactDetails?.email || null;
      const isCall = lead.leadType === "PHONE_CALL";
      const isMessage = lead.leadType === "MESSAGE";
      const category = (lead.categoryId || "").replace("xcat:service_area_business_", "").replace(/_/g, " ");

      const msgText = messageMap[leadId] || "";

      // Try to extract name from message text or email
      let name = "";
      if (msgText) {
        // "My name is John Smith" or "name is John Smith"
        const nameIsMatch = msgText.match(/(?:my\s+)?name\s+is\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
        // "John Smith\nemail@..." (name on its own line before email)
        const lineMatch = msgText.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\n/m);
        // "- John Smith" or "Sincerely, John Smith"
        const signoffMatch = msgText.match(/(?:sincerely|regards|thanks|thank you)[,\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);

        const nameMatch = nameIsMatch || lineMatch || signoffMatch;
        if (nameMatch) name = nameMatch[1].trim();
      }
      if (!name && email && !email.includes("@lead.justindleigh.com")) {
        // Use email prefix as a rough name (capitalize)
        const prefix = email.split("@")[0].replace(/[._-]/g, " ").replace(/\d+/g, "").trim();
        if (prefix.length > 2) name = prefix.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      }
      if (!name && phone) {
        const clean = phone.replace("+1", "");
        name = `(${clean.slice(0,3)}) ${clean.slice(3,6)}-${clean.slice(6)}`;
      }
      if (!name) name = `LSA Lead #${leadId}`;

      // Extract phone number from message text if not provided by API
      let extractedPhone = phone;
      if (!extractedPhone && msgText) {
        // Match patterns: (727) 235-3670, 727-235-3670, 727 235 3670, 7272353670, +1...
        const phoneMatch = msgText.match(/(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
        if (phoneMatch) {
          const digits = phoneMatch[0].replace(/\D/g, "");
          const normalized = digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits[0] === "1" ? `+${digits}` : null;
          if (normalized) extractedPhone = normalized;
        }
      }

      const details = [`Google LSA Lead`, `Type: ${lead.leadType}`, `Category: ${category}`, lead.serviceId ? `Service: ${lead.serviceId}` : null, `Created: ${lead.creationDateTime}`, lead.leadCharged ? "Charged: Yes" : "Charged: No"].filter(Boolean).join("\n");

      const submission: Record<string, unknown> = {
        name,
        email: email || `lsa-${leadId}@lead.justindleigh.com`,
        phone: extractedPhone,
        subject: category || "Legal Inquiry (Google LSA)",
        message: msgText ? `${msgText}\n\n---\n${details}` : details,
        how_heard: "Google LSA",
        status: "new",
        lead_source: "lsa",
        lead_date: lead.creationDateTime ? new Date(lead.creationDateTime.replace(" ", "T") + "Z").toISOString() : null,
        lead_type: isCall ? "call" : isMessage ? "message" : "form",
        lsa_lead_id: leadId,
        call_recording_url: recordingMap[leadId] || null,
      };

      const { error } = await supabase.from("contact_submissions").insert(submission);
      if (!error) imported++;
      else errors.push(`${leadId}: ${error.message}`);
    }

    return json(200, {
      success: true, imported, skipped,
      total_from_api: leads.length,
      recordings: Object.keys(recordingMap).length,
      messages: Object.keys(messageMap).length,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (err) {
    return json(500, { error: err.message });
  }
});

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body, null, 2), { status, headers: { "Content-Type": "application/json" } });
}
