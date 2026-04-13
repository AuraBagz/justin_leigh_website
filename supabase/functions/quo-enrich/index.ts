// Fetches transcript, summary, and recording for a call from Quo API
// Stores results in call_records table

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const QUO_API = "https://api.openphone.com/v1";

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors() });
  }

  try {
    const { callId } = await req.json();
    if (!callId) return res(400, { error: "callId required" });

    const quoKey = Deno.env.get("QUO_API_KEY");
    if (!quoKey) return res(400, { error: "QUO_API_KEY not set" });

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseKey) return res(400, { error: "Missing Supabase env vars" });

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const quoHeaders = { Authorization: quoKey };
    const results: Record<string, unknown> = {};

    // 1. Fetch transcript
    try {
      const r = await fetch(`${QUO_API}/call-transcripts/${callId}`, { headers: quoHeaders });
      const body = await r.text();
      if (r.ok) {
        const parsed = JSON.parse(body);
        const obj = parsed.data || parsed;
        if (obj?.dialogue && obj.dialogue.length > 0) {
          const text = obj.dialogue.map((d: any) => {
            const speaker = d.userId ? "Justin" : (d.identifier || "Caller");
            const m = Math.floor((d.start || 0) / 60);
            const s = Math.floor((d.start || 0) % 60);
            return `[${m}:${s.toString().padStart(2, "0")}] ${speaker}: ${d.content}`;
          }).join("\n");

          const { error } = await supabase.from("call_records")
            .update({ transcript: obj.dialogue, transcript_text: text, duration: obj.duration || null })
            .eq("quo_call_id", callId);

          results.transcript = error ? `error: ${error.message}` : `${obj.dialogue.length} lines`;
        } else {
          results.transcript = `status: ${obj?.status || "no dialogue"}`;
        }
      } else {
        results.transcript = `http ${r.status}: ${body.substring(0, 100)}`;
      }
    } catch (e) { results.transcript = `exception: ${e.message}`; }

    // 2. Fetch summary
    try {
      const r = await fetch(`${QUO_API}/call-summaries/${callId}`, { headers: quoHeaders });
      if (r.ok) {
        const parsed = await r.json();
        const obj = parsed.data || parsed;
        if (obj?.summary || obj?.nextSteps) {
          const { error } = await supabase.from("call_records")
            .update({ summary: obj.summary || [], next_steps: obj.nextSteps || [] })
            .eq("quo_call_id", callId);
          results.summary = error ? `error: ${error.message}` : "updated";
        }
      } else {
        results.summary = `http ${r.status}`;
      }
    } catch (e) { results.summary = `exception: ${e.message}`; }

    // 3. Fetch recording
    try {
      const r = await fetch(`${QUO_API}/call-recordings/${callId}`, { headers: quoHeaders });
      if (r.ok) {
        const parsed = await r.json();
        const url = parsed.data?.media?.[0]?.url || parsed.data?.url;
        if (url) {
          await supabase.from("call_records").update({ recording_url: url }).eq("quo_call_id", callId);
          results.recording = "updated";
        }
      } else {
        results.recording = `http ${r.status}`;
      }
    } catch (e) { results.recording = `exception: ${e.message}`; }

    return res(200, { success: true, callId, results });
  } catch (err) {
    return res(500, { error: err.message });
  }
});

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function res(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...cors() },
  });
}
