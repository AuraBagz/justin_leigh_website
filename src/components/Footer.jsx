export default function Footer() {
  return (
    <footer aria-label="Site footer" className="bg-black border-t border-white/5 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-gold/40 flex items-center justify-center text-gold font-serif font-bold text-xs">
              JL
            </div>
            <span className="text-sm text-white/30">
              Law Office of Justin D. Leigh
            </span>
          </div>
          <div className="flex items-center gap-8">
            <a
              href="/#about"
              className="text-xs text-white/25 hover:text-gold/70 transition-colors tracking-wide"
            >
              About
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 text-center text-[11px] text-white/15 tracking-wide">
          &copy; {new Date().getFullYear()} Law Office of Justin D. Leigh. All
          rights reserved. | Attorney advertising. Prior results do not guarantee
          a similar outcome.
        </div>
      </div>
    </footer>
  );
}
