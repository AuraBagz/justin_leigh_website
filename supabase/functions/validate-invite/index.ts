// Validates a portal invite token server-side (no RLS needed)
// Returns invite status without exposing the full table

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors() });

  try {
    const { token, action, email } = await req.json();
    if (!token) return json(400, { error: "Token required" });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Look up the invite
    const { data: invite, error } = await supabase
      .from("portal_invites")
      .select("id, email, status, expires_at, client_id")
      .eq("token", token)
      .single();

    if (error || !invite) return json(404, { valid: false, reason: "invalid" });
    if (invite.status !== "pending") return json(400, { valid: false, reason: "used" });
    if (new Date(invite.expires_at) < new Date()) return json(400, { valid: false, reason: "expired" });

    // Validate only — return limited info
    if (action === "validate") {
      return json(200, { valid: true, email: invite.email });
    }

    // Accept invite — verify email matches
    if (action === "accept") {
      if (!email) return json(400, { error: "Email required to accept" });
      if (email.toLowerCase() !== invite.email.toLowerCase()) {
        return json(403, { valid: false, reason: "email_mismatch", expected_email: invite.email });
      }

      // Mark invite as accepted
      await supabase.from("portal_invites")
        .update({ status: "accepted", accepted_at: new Date().toISOString() })
        .eq("id", invite.id);

      // Enable portal access on the client
      await supabase.from("clients")
        .update({ portal_access: true })
        .eq("id", invite.client_id);

      return json(200, { valid: true, accepted: true });
    }

    return json(400, { error: "Invalid action. Use 'validate' or 'accept'." });
  } catch (err) {
    return json(500, { error: err.message });
  }
});

function cors() {
  return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors() } });
}
