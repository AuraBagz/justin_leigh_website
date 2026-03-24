import useInView from "../hooks/useInView";

const areas = [
  {
    title: "Real Estate & Land Use",
    desc: "Property acquisition, development guidance, land use planning, and zoning law for public and private clients.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M3 21h18M3 7v1a3 3 0 006 0V7m0 0V4h6v3m0 0v1a3 3 0 006 0V7M6 21V10m12 11V10M3 7h18" /></svg>,
  },
  {
    title: "Landlord-Tenant",
    desc: "Balanced representation for both landlords and tenants in rental property disputes and agreements.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M9 22V12h6v10" /></svg>,
  },
  {
    title: "Estate Planning & Probate",
    desc: "Protect your legacy with comprehensive estate planning, wills, trusts, and probate administration.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  },
  {
    title: "Personal Injury",
    desc: "Contingency-based representation for negligence claims - you don't pay unless we win.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  },
  {
    title: "Business Strategy",
    desc: "Strategic counsel for startups and established entrepreneurs from formation through growth.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
  },
  {
    title: "Alcohol Beverage Law",
    desc: "Industry-specific counsel from an attorney with firsthand brewery ownership experience.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><path d="M6 1v3M10 1v3M14 1v3" /></svg>,
  },
  {
    title: "Criminal Defense",
    desc: "Vigorous defense of your rights with personalized attention to every detail of your case.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  },
  {
    title: "Civil Litigation",
    desc: "Strategic advocacy in civil disputes, from initial case assessment through resolution or trial.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>,
  },
  {
    title: "Trademark Law",
    desc: "Registration, protection, and dispute resolution to safeguard your brand and intellectual property.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5zM6 9.01V9" /><path d="M15 5l6.3 6.3a2.4 2.4 0 010 3.4L17 19" /></svg>,
  },
];

export default function PracticeAreas() {
  const [ref, inView] = useInView();

  return (
    <section id="practice" className="relative bg-black py-28 px-6">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />

      <div ref={ref} className="max-w-7xl mx-auto relative">
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-[11px] font-semibold tracking-[4px] uppercase text-gold mb-4 block">
            What We Do
          </span>
          <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] font-light text-white">
            Comprehensive{" "}
            <span className="text-gradient-gold font-semibold">Legal Services</span>
          </h2>
          <div className="w-16 h-px bg-gold/40 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
          {areas.map((area, i) => (
            <div
              key={area.title}
              className={`group bg-black p-8 hover:bg-white/[0.03] transition-all duration-500 relative ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{
                transitionDelay: inView ? `${0.1 + i * 0.07}s` : "0s",
                transitionDuration: "0.6s",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="w-12 h-12 bg-gold/10 text-gold flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                {area.icon}
              </div>
              <h3 className="font-serif text-xl font-semibold text-white mb-3">{area.title}</h3>
              <p className="text-sm leading-relaxed text-white/35 group-hover:text-white/50 transition-colors">{area.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
