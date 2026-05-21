import { CircleDot, Sparkles } from "lucide-react";

type NavbarProps = {
  onOpenSilver?: () => void;
};

export default function Navbar({ onOpenSilver }: NavbarProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-[60] border-b border-white/10 bg-gradient-to-r from-[#020617]/90 via-[#030712]/85 to-[#020617]/90 shadow-2xl shadow-black/20 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-5 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-lg shadow-blue-500/10">
            <CircleDot className="h-4.5 w-4.5 text-blue-300" aria-hidden="true" />
          </div>

          <div className="leading-tight">
            <h1 className="text-sm font-bold tracking-tight text-white sm:text-base">
              NBA Arena Explorer
            </h1>
            <p className="mt-0.5 text-[11px] font-medium text-white/50 sm:text-xs">
              Explore. Plan. Experience.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSilver}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-purple-400 hover:to-blue-400 hover:shadow-blue-500/35 sm:px-4"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Silver AI
        </button>
      </div>
    </header>
  );
}
