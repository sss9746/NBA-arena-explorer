import { CircleDot, Sparkles } from "lucide-react";

const navItems = ["Map", "Teams", "Road Trip Mode"];

export default function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-[60] border-b border-white/10 bg-gradient-to-r from-[#020617]/90 via-[#030712]/85 to-[#020617]/90 shadow-2xl shadow-black/20 backdrop-blur-md">
      <div className="flex h-[72px] items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-lg shadow-blue-500/10">
            <CircleDot className="h-5 w-5 text-blue-300" aria-hidden="true" />
          </div>

          <div className="leading-tight">
            <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
              NBA Arena Explorer
            </h1>
            <p className="mt-0.5 text-xs font-medium text-white/50">
              Explore. Plan. Experience.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/65 transition hover:bg-white/8 hover:text-white"
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-purple-400 hover:to-blue-400 hover:shadow-blue-500/35"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Ask Silver
          </button>
        </div>
      </div>
    </header>
  );
}
