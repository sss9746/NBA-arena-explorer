"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Ruler, Users } from "lucide-react";

export default function ArenaDetailsTab({ team }) {
  const [mapFailed, setMapFailed] = useState(false);

  const stats = [
    {
      icon: Users,
      label: "Capacity",
      value: team.capacity,
      color: "text-blue-400",
    },
    {
      icon: CalendarDays,
      label: "Year Built",
      value: team.yearBuilt,
      color: "text-emerald-400",
    },
    {
      icon: MapPin,
      label: "Location",
      value: team.city,
      color: "text-orange-400",
    },
    {
      icon: Ruler,
      label: "Court Size",
      value: "94 × 50 ft",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="dark space-y-4 px-5 py-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Arena Information
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-border/50 bg-secondary/60 p-4 backdrop-blur-sm transition-colors hover:border-primary/30"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-background">
                <Icon className={`h-[18px] w-[18px] ${stat.color}`} />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="aspect-video overflow-hidden rounded-2xl border border-border/50 bg-secondary/40"
      >
        {mapFailed ? (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            <span>{team.city}</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${team.lat},${team.lng}&zoom=15&size=600x300&maptype=roadmap&style=feature:all|element:geometry|color:0x1a1d2e&style=feature:all|element:labels.text.fill|color:0x8899aa&key=placeholder`}
            alt="Map preview"
            className="h-full w-full object-cover opacity-60"
            onError={() => setMapFailed(true)}
          />
        )}
      </motion.div>
    </div>
  );
}
