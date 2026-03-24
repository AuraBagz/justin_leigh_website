import "@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const form = await req.json();
    const isAI = form.type === "ai_inquiry";

    let rows: string;
    let emailSubject: string;
    let heading: string;
    let footerNote: string;

    if (isAI) {
      // A.I. Consultation Inquiry
      const fields = [
        ["Name", form.name],
        ["Email", form.email],
        ["Phone", form.phone],
        ["Practice Details", form.message],
      ].filter(([, v]) => v);

      rows = fields
        .map(
          ([label, value]) =>
            `<tr><td style="padding:8px 12px;font-weight:bold;color:#c9a84c;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:8px 12px;color:#ffffff">${String(value).replace(/\n/g, "<br>")}</td></tr>`
        )
        .join("");

      emailSubject = `A.I. Consultation Submission - ${form.name}`;
      heading = "New A.I. Consultation Inquiry";
      footerNote = "Submitted via Stalefish A.I. Consultation form";
    } else {
      // Legal Contact Form
      const fields = [
        ["Name", form.name],
        ["Email", form.email],
        ["Phone", form.phone],
        ["Subject", form.subject],
        ["Message", form.message],
        ["Opposing Party", form.opposing_party],
        ["How They Heard", form.how_heard],
        ["Real Estate Inquiry", form.real_estate_inquiry],
        ["Court Case", form.court_case],
        ["Other Attorney", form.other_attorney],
      ].filter(([, v]) => v);

      rows = fields
        .map(
          ([label, value]) =>
            `<tr><td style="padding:8px 12px;font-weight:bold;color:#c9a84c;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:8px 12px;color:#ffffff">${String(value).replace(/\n/g, "<br>")}</td></tr>`
        )
        .join("");

      emailSubject = `New Legal Inquiry: ${form.subject} - ${form.name}`;
      heading = "New Contact Form Submission";
      footerNote = "Submitted via justindleigh.com contact form";
    }

    const html = `
      <div style="background:#0a1628;padding:32px;font-family:Arial,sans-serif">
        <h2 style="color:#c9a84c;margin:0 0 24px">${heading}</h2>
        ${isAI ? '<div style="display:inline-block;background:#c9a84c;color:#0a1628;padding:4px 12px;font-size:12px;font-weight:bold;letter-spacing:1px;margin-bottom:16px">STALEFISH A.I.</div>' : ''}
        <table style="width:100%;border-collapse:collapse;background:#000;border:1px solid #1a2a44">
          ${rows}
        </table>
        <p style="color:#666;font-size:12px;margin-top:24px">
          ${footerNote} at ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: isAI
          ? "Stalefish A.I. <onboarding@resend.dev>"
          : "Law Office Contact <onboarding@resend.dev>",
        to: ["justindleigh@gmail.com"],
        subject: emailSubject,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
