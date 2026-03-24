import { useState } from "react";
import { supabase } from "../lib/supabase";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  opposing_party: "",
  how_heard: "",
  real_estate_inquiry: "",
  court_case: "",
  other_attorney: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert([{
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          subject: form.subject,
          message: form.message,
          opposing_party: form.opposing_party || null,
          how_heard: form.how_heard || null,
          real_estate_inquiry: form.real_estate_inquiry || null,
          court_case: form.court_case || null,
          other_attorney: form.other_attorney || null,
        }]);

      if (dbError) throw dbError;

      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        await fetch(`${supabaseUrl}/functions/v1/send-contact-email`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      } catch {
        console.warn("Email notification failed, but form was saved.");
      }

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center px-6 py-28">
        <div className="max-w-xl text-center">
          <div className="w-16 h-16 bg-gold/20 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
              <path d="M5 13l4 4L19 7" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl font-light text-white mb-4">Thank You</h1>
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            Your inquiry has been received. Justin typically responds within two
            business days. If your matter is urgent, please call directly.
          </p>
          <a href="/" className="inline-block px-8 py-4 bg-gold text-navy text-sm font-bold tracking-wide hover:bg-gold-light transition-colors">
            Return Home
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black py-28 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[11px] font-semibold tracking-[4px] uppercase text-gold mb-4 block">
            Get in Touch
          </span>
          <h1 className="font-serif text-[clamp(2rem,4vw,3.5rem)] font-light text-white mb-4">
            Schedule a{" "}
            <span className="text-gradient-gold font-semibold">Consultation</span>
          </h1>
          <p className="text-white text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            I prioritize accessibility and responsiveness, meeting clients at
            locations that best suit their needs. I offer complimentary initial
            consultations to discuss your legal matters and develop a plan
            tailored to your goals.
          </p>
          <p className="text-white/70 text-sm mt-3">
            I typically respond within two business days. If your matter is
            urgent, please indicate that in the subject line.
          </p>
        </div>

        {/* Contact Info Bar */}
        <div className="grid sm:grid-cols-3 gap-6 mb-14 py-6 border-t border-b border-white/5">
          {[
            { label: "Office", value: "106 N. Grant St.\nGoldendale, WA 98620" },
            { label: "Hours", value: "By Appointment Only" },
            { label: "Phone", value: "(509) 426-4416" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-[11px] font-semibold tracking-[3px] uppercase text-white/25 mb-2">{item.label}</div>
              <div className="font-serif text-lg text-white/70 whitespace-pre-line leading-snug">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Location Section - Map + Office Image */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">
          {/* Google Maps Embed */}
          <div className="relative overflow-hidden border border-white/10">
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2792.5!2d-120.8283!3d45.8214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5496a8e3a4e5c9e7%3A0x1234567890abcdef!2s106%20N%20Grant%20St%2C%20Goldendale%2C%20WA%2098620!5e0!3m2!1sen!2sus!4v1711300000000!5m2!1sen!2sus"
              width="100%"
              height="320"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.3) brightness(0.8)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent" />
          </div>

          {/* Office Front Image */}
          <div className="relative overflow-hidden border border-white/10">
            <img
              src="/office_front.webp"
              alt="Law Office of Justin D. Leigh - Downtown Goldendale"
              className="w-full h-[320px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-5 pt-12">
              <div className="text-[10px] font-semibold tracking-[3px] uppercase text-gold mb-1">Location</div>
              <div className="font-serif text-sm text-white/80 leading-snug">
                106 N. Grant St., Goldendale, WA 98620
              </div>
              <div className="text-xs text-white/40 mt-1">
                Corner of N. Grant St. & W. Main St.
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <FormField label="Name" name="name" required value={form.name} onChange={handleChange} placeholder="Your full name" />
            <FormField label="Email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <FormField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(optional)" />
            <FormField label="Subject" name="subject" required value={form.subject} onChange={handleChange} placeholder="Brief description of your inquiry" />
          </div>
          <FormField label="How can I help you?" name="message" textarea required value={form.message} onChange={handleChange} placeholder="Please describe your legal matter..." />
          <FormField label="Name of Opposing Party/Parties" name="opposing_party" textarea value={form.opposing_party} onChange={handleChange} placeholder="For conflict review purposes (optional)" />
          <FormField label="How did you hear about me?" name="how_heard" value={form.how_heard} onChange={handleChange} placeholder="(optional)" />
          <FormField label="Is your inquiry pertaining to real estate?" name="real_estate_inquiry" value={form.real_estate_inquiry} onChange={handleChange} placeholder="If yes, please include address or parcel number (optional)" />
          <FormField label="Is your matter related to an existing court case?" name="court_case" value={form.court_case} onChange={handleChange} placeholder="If yes, please provide case details (optional)" />
          <FormField label="Is there another attorney involved?" name="other_attorney" value={form.other_attorney} onChange={handleChange} placeholder="If yes, please provide their name (optional)" />

          {status === "error" && (
            <div className="bg-red-500/10 border border-red-500/20 px-5 py-4 text-red-400 text-sm">{errorMsg}</div>
          )}

          <p className="text-white/20 text-xs leading-relaxed">
            Please do not submit any confidential or sensitive information
            through this form. Submitting this form does not create an
            attorney-client relationship.
          </p>

          <button type="submit" disabled={status === "sending"}
            className="w-full sm:w-auto px-10 py-4 bg-gold text-navy text-sm font-bold tracking-wide hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {status === "sending" ? "Submitting..." : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </section>
  );
}

function FormField({ label, name, type = "text", required, textarea, value, onChange, placeholder }) {
  const baseClass =
    "w-full bg-white/[0.04] border border-white/10 px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors";
  return (
    <div>
      <label htmlFor={name} className="block text-[13px] font-medium text-white/50 mb-2">
        {label}{required && <span className="text-gold ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea id={name} name={name} required={required} value={value} onChange={onChange} placeholder={placeholder} rows={4} className={baseClass + " resize-y min-h-[100px]"} />
      ) : (
        <input id={name} name={name} type={type} required={required} value={value} onChange={onChange} placeholder={placeholder} className={baseClass} />
      )}
    </div>
  );
}
