"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function PlayersTab({ players = [] }) {
  if (!players.length) {
    return (
      <div className="dark px-5 py-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Roster
        </h3>
        <p className="text-sm text-muted-foreground">
          Player data will show up here once you add the roster.
        </p>
      </div>
    );
  }

  return (
    <div className="dark space-y-1 px-5 py-4">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Roster
      </h3>

      {players.map((player, index) => {
        const number = player.number ?? String(index + 1).padStart(2, "0");
        const position = player.position ?? "Roster";

        return (
          <motion.div
            key={player.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <motion.button
              type="button"
              whileHover={{ x: 4, backgroundColor: "hsl(220 15% 18%)" }}
              whileTap={{ scale: 0.98 }}
              className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all"
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-secondary ring-2 ring-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={player.image}
                  alt={player.name}
                  className="h-full w-full object-cover object-top"
                  onError={(event) => {
                    const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=2a2d3a&color=fff&size=88`;

                    if (event.currentTarget.src !== fallbackSrc) {
                      event.currentTarget.src = fallbackSrc;
                    }
                  }}
                />
              </div>

              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-[13px] font-semibold text-foreground sm:text-sm">
                  {player.name}
                </p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">
                  #{number} · {position}
                </p>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" />
            </motion.button>

            {index < players.length - 1 ? (
              <div className="ml-16 border-b border-border/30" />
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}
