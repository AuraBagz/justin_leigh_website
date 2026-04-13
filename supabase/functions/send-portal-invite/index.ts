// Sends a branded portal invite email to a client via Resend
// Called from the CRM when Justin clicks "Send Portal Invite"
//
// Required secrets: RESEND_API_KEY (already configured)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const PORTAL_URL = "https://portal.justindleigh.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors() });

  try {
    const { client_id, email, name, case_type } = await req.json();
    if (!client_id || !email) return json(400, { error: "client_id and email required" });
    if (!RESEND_API_KEY) return json(500, { error: "RESEND_API_KEY not configured" });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Create invite token
    const { data: invite, error: inviteErr } = await supabase
      .from("portal_invites")
      .insert({ client_id, email })
      .select()
      .single();

    if (inviteErr || !invite) return json(500, { error: "Failed to create invite", details: inviteErr?.message });

    // Enable portal access
    await supabase.from("clients").update({ portal_access: true }).eq("id", client_id);

    const inviteLink = `${PORTAL_URL}/invite?token=${invite.token}`;
    const clientName = name || "Valued Client";
    const caseLabel = case_type ? case_type.replace(/_/g, " ") : "your legal matter";

    // Build email
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f6fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

    <!-- Header -->
    <div style="background:#0c0f1d;padding:32px 40px;text-align:center;">
      <div style="display:inline-block;width:48px;height:48px;background:#2563eb;border-radius:12px;line-height:48px;">
        <span style="color:white;font-size:24px;font-weight:bold;">&#9878;</span>
      </div>
      <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:16px 0 4px;letter-spacing:-0.5px;">Law Office of Justin D. Leigh</h1>
      <p style="color:#8b90a7;font-size:13px;margin:0;">Client Portal Access</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <p style="color:#0c0f1d;font-size:16px;line-height:1.6;margin:0 0 20px;">
        Dear ${clientName},
      </p>
      <p style="color:#334155;font-size:14.5px;line-height:1.7;margin:0 0 24px;">
        You have been granted access to your secure client portal. Through the portal, you can view updates regarding ${caseLabel}, securely upload and download documents, and stay informed on your case status.
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${inviteLink}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:15px;font-weight:600;letter-spacing:0.2px;">
          Access Your Portal
        </a>
      </div>

      <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 16px;">
        This link will expire in 7 days. If you have any questions or need assistance accessing the portal, please do not hesitate to contact our office.
      </p>

      <!-- Contact Info -->
      <div style="background:#f8fafc;border:1px solid #e4e7f0;border-radius:10px;padding:16px 20px;margin-top:24px;">
        <p style="color:#0c0f1d;font-size:13px;font-weight:600;margin:0 0 8px;">Contact Us</p>
        <p style="color:#5a607a;font-size:13px;margin:0;line-height:1.8;">
          Phone: (509) 773-8469<br>
          Email: justindleigh@gmail.com<br>
          Goldendale, Washington
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-top:1px solid #e4e7f0;padding:20px 40px;text-align:center;">
      <p style="color:#8b90a7;font-size:11px;margin:0;">
        This is a secure communication from the Law Office of Justin D. Leigh.<br>
        Licensed in Washington &amp; Oregon &bull; WSBA #55307
      </p>
    </div>
  </div>
</body>
</html>`;

    // Send via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Law Office of Justin D. Leigh <hello@justindleigh.com>",
        to: [email],
        subject: "Your Secure Client Portal Access — Law Office of Justin D. Leigh",
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) return json(res.status, { error: "Email send failed", details: data });

    return json(200, {
      success: true,
      email_id: data.id,
      invite_token: invite.token,
      invite_link: inviteLink,
    });

  } catch (err) {
    return json(500, { error: err.message });
  }
});

function cors() {
  return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Allow-Methods": "POST, OPTIONS" };
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body, null, 2), { status, headers: { "Content-Type": "application/json", ...cors() } });
}
