// Supabase Edge Function: google-calendar-sync
// One-way push from CRM calendar_events to Justin's Google Calendar
//
// Required secrets:
//   GOOGLE_LSA_CLIENT_ID, GOOGLE_LSA_CLIENT_SECRET (reused from LSA)
//   GOOGLE_CALENDAR_REFRESH_TOKEN (scope: https://www.googleapis.com/auth/calendar)
//
// Deploy: cd law-site && npx supabase functions deploy google-calendar-sync --no-verify-jwt

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GCAL_API = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
const TIMEZONE = "America/Los_Angeles";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors() });

  try {
    const { action, event } = await req.json();
    if (!action || !event) return json(400, { error: "action and event required" });

    const clientId = Deno.env.get("GOOGLE_LSA_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_LSA_CLIENT_SECRET");
    const refreshToken = Deno.env.get("GOOGLE_CALENDAR_REFRESH_TOKEN");

    if (!clientId || !clientSecret || !refreshToken) {
      return json(400, { error: "Missing Google Calendar credentials. Set GOOGLE_CALENDAR_REFRESH_TOKEN in Edge Function secrets." });
    }

    // Get access token
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId, client_secret: clientSecret,
        refresh_token: refreshToken, grant_type: "refresh_token",
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return json(401, { error: "Token exchange failed", details: tokenData });

    const authHeaders = {
      "Authorization": `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json",
    };

    // Build Google Calendar event body
    const gcalEvent: Record<string, unknown> = {
      summary: event.title,
      description: [event.description, event.notes].filter(Boolean).join("\n\n"),
    };

    // Ensure dates are proper ISO format with timezone
    const startDate = new Date(event.event_date);
    const endDate = event.end_date ? new Date(event.end_date) : new Date(startDate.getTime() + 60 * 60 * 1000);

    if (event.all_day) {
      const fmtDate = (d: Date) => d.toISOString().split("T")[0];
      gcalEvent.start = { date: fmtDate(startDate) };
      gcalEvent.end = { date: fmtDate(endDate) };
    } else {
      gcalEvent.start = { dateTime: startDate.toISOString(), timeZone: TIMEZONE };
      gcalEvent.end = { dateTime: endDate.toISOString(), timeZone: TIMEZONE };
    }

    let googleEventId = event.google_calendar_event_id || null;
    let result: Record<string, unknown> = {};

    if (action === "create") {
      const res = await fetch(GCAL_API, { method: "POST", headers: authHeaders, body: JSON.stringify(gcalEvent) });
      const data = await res.json();
      if (!res.ok) return json(res.status, { error: "Google Calendar create failed", details: data });
      googleEventId = data.id;
      result = { action: "created", google_event_id: googleEventId };

      // Write back the Google Calendar event ID to our DB
      if (event.id) {
        const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
        await supabase.from("calendar_events").update({ google_calendar_event_id: googleEventId }).eq("id", event.id);
      }

    } else if (action === "update" && googleEventId) {
      const res = await fetch(`${GCAL_API}/${googleEventId}`, { method: "PATCH", headers: authHeaders, body: JSON.stringify(gcalEvent) });
      const data = await res.json();
      if (!res.ok) return json(res.status, { error: "Google Calendar update failed", details: data });
      result = { action: "updated", google_event_id: googleEventId };

    } else if (action === "delete" && googleEventId) {
      const res = await fetch(`${GCAL_API}/${googleEventId}`, { method: "DELETE", headers: authHeaders });
      if (!res.ok && res.status !== 410) {
        const text = await res.text();
        return json(res.status, { error: "Google Calendar delete failed", body: text });
      }
      result = { action: "deleted", google_event_id: googleEventId };

    } else {
      return json(400, { error: `Invalid action '${action}' or missing google_calendar_event_id for update/delete` });
    }

    return json(200, { success: true, ...result });
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
