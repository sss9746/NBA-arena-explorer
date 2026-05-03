"use client";

import { useState } from "react";
import SilverChatPanel from "@/components/SilverChatPanel";
import ArenaMap from "@/components/ui/ArenaMap";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [silverOpen, setSilverOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar onOpenSilver={() => setSilverOpen(true)} />

      <div className="px-6 pt-6 pb-6">
        <ArenaMap />
      </div>

      <SilverChatPanel
        open={silverOpen}
        onClose={() => setSilverOpen(false)}
      />
    </main>
  );
}
