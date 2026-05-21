"use client";

import { useState } from "react";
import SilverChatPanel from "@/components/SilverChatPanel";
import ArenaMap from "@/components/ui/ArenaMap";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [silverOpen, setSilverOpen] = useState(false);
  const [selectedTeamContext, setSelectedTeamContext] = useState<{
    teamName: string;
    arenaName: string;
  } | null>(null);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar onOpenSilver={() => setSilverOpen(true)} />

      <div className="px-6 pt-6 pb-6">
        <ArenaMap onSelectedTeamChange={setSelectedTeamContext} />
      </div>

      <SilverChatPanel
        open={silverOpen}
        onClose={() => setSilverOpen(false)}
        selectedTeamName={selectedTeamContext?.teamName ?? null}
        selectedArenaName={selectedTeamContext?.arenaName ?? null}
      />
    </main>
  );
}
