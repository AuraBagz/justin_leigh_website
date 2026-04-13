const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

Deno.serve(async (_req) => {
  const clientId = Deno.env.get("GOOGLE_LSA_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_LSA_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GOOGLE_LSA_REFRESH_TOKEN");
  const developerToken = Deno.env.get("GOOGLE_ADS_DEVELOPER_TOKEN");
  const managerId = Deno.env.get("GOOGLE_ADS_CUSTOMER_ID")?.replace(/-/g, "");
  const lsaAccountId = "8068698325";

  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId!, client_secret: clientSecret!,
      refresh_token: refreshToken!, grant_type: "refresh_token",
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return new Response(JSON.stringify({ error: "token failed", details: tokenData }, null, 2),
      { headers: { "Content-Type": "application/json" } });
  }

  const headers = {
    "Authorization": `Bearer ${tokenData.access_token}`,
    "developer-token": developerToken!,
    "login-customer-id": managerId!,
    "Content-Type": "application/json",
  };

  const results: Record<string, unknown> = { managerId, lsaAccountId };

  // Query LSA leads on the linked account (8068698325) using manager login
  try {
    const r = await fetch(`https://googleads.googleapis.com/v23/customers/${lsaAccountId}/googleAds:search`, {
      method: "POST", headers,
      body: JSON.stringify({ query: "SELECT local_services_lead.id, local_services_lead.lead_type, local_services_lead.category_id, local_services_lead.contact_details, local_services_lead.creation_date_time FROM local_services_lead ORDER BY local_services_lead.creation_date_time DESC LIMIT 5" }),
    });
    const text = await r.text();
    results["lsaLeads"] = { status: r.status, body: text.substring(0, 2000) };
  } catch (e) { results["lsaLeads"] = { error: (e as Error).message }; }

  // Also try conversations for recordings
  try {
    const r = await fetch(`https://googleads.googleapis.com/v23/customers/${lsaAccountId}/googleAds:search`, {
      method: "POST", headers,
      body: JSON.stringify({ query: "SELECT local_services_lead_conversation.id, local_services_lead_conversation.lead, local_services_lead_conversation.conversation_channel, local_services_lead_conversation.phone_call_details.call_recording_url FROM local_services_lead_conversation ORDER BY local_services_lead_conversation.event_date_time DESC LIMIT 3" }),
    });
    const text = await r.text();
    results["conversations"] = { status: r.status, body: text.substring(0, 2000) };
  } catch (e) { results["conversations"] = { error: (e as Error).message }; }

  return new Response(JSON.stringify(results, null, 2), { headers: { "Content-Type": "application/json" } });
});
