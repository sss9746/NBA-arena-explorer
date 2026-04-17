"use client";

import ArenaMap from "@/components/ui/ArenaMap";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="px-6 pt-6 pb-6">
        <ArenaMap />
      </div>
    </main>
  );
}
