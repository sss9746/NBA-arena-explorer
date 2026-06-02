"use client";

import { useState } from "react";
import SilverChatPanel from "@/components/SilverChatPanel";
import ArenaMap from "@/components/ui/ArenaMap";
import Navbar from "@/components/Navbar";
import type { RoadTripItinerary } from "@/src/lib/roadTripPlanner";

export default function Home() {
  const [silverOpen, setSilverOpen] = useState(false);
  const [selectedTeamContext, setSelectedTeamContext] = useState<{
    teamName: string;
    arenaName: string;
  } | null>(null);
  const [activeRoadTrip, setActiveRoadTrip] =
    useState<RoadTripItinerary | null>(null);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar onOpenSilver={() => setSilverOpen(true)} />

      <div className="px-6 pt-6 pb-6">
        <ArenaMap
          onSelectedTeamChange={setSelectedTeamContext}
          activeRoadTrip={activeRoadTrip}
          onClearRoadTrip={() => setActiveRoadTrip(null)}
        />
      </div>

      <SilverChatPanel
        open={silverOpen}
        onClose={() => setSilverOpen(false)}
        selectedTeamName={selectedTeamContext?.teamName ?? null}
        selectedArenaName={selectedTeamContext?.arenaName ?? null}
        activeRoadTrip={activeRoadTrip}
        onRoadTripGenerated={setActiveRoadTrip}
      />
    </main>
  );
}
