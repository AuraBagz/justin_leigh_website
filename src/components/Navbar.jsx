import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Practice Areas", href: "/#practice", section: "practice" },
  { label: "About", href: "/#about", section: "about" },
  { label: "Why Choose Us", href: "/#why", section: "why" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("practice");
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Only track sections on home page
      if (location.pathname !== "/") return;

      const sections = ["practice", "about", "why", "contact"];
      let current = "practice";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  // Handle hash scrolling when navigating from another page
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-nav-down ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl shadow-2xl shadow-black/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-gold/60 flex items-center justify-center text-gold font-serif font-bold text-sm group-hover:bg-gold/10 transition-colors">
            JL
          </div>
          <span className="font-medium tracking-tight text-white text-sm hidden sm:block">
            Justin D. Leigh
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              location.pathname === "/contact"
                ? link.href === "/contact"
                : link.section === activeSection;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                )}
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:5094264416"
            className="text-[13px] text-gold hover:text-gold-light transition-colors px-3 py-2"
          >
            (509) 426-4416
          </a>
          <Link
            to="/contact"
            className="relative px-5 py-2.5 text-[13px] font-semibold text-navy bg-gradient-to-b from-white to-white/80 hover:from-gold-light hover:to-gold transition-all duration-300 tracking-wide"
          >
            Free Consultation
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span
            className={`w-5 h-px bg-white transition-transform duration-300 ${
              mobileOpen ? "rotate-45 translate-y-[3.5px]" : ""
            }`}
          />
          <span
            className={`w-5 h-px bg-white transition-opacity duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-5 h-px bg-white transition-transform duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
            }`}
          />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-5 py-3 text-sm font-semibold text-navy bg-white text-center"
            >
              Free Consultation
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-80px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-nav-down {
          animation: navSlideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </nav>
  );
}
