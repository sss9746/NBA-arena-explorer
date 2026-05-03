"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function HeroBanner({ team, onImageError }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative mx-5 aspect-video overflow-hidden rounded-2xl sm:mx-6"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={team.bannerImage}
        alt={team.arena}
        className="h-full w-full object-cover"
        onError={onImageError}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-base font-bold text-white">{team.arena}</h3>
        <div className="mt-1 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-white/70" />
          <span className="text-xs font-medium text-white/70">{team.city}</span>
        </div>
      </div>
      <div
        className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
        style={{ background: team.color }}
      >
        {team.abbreviation}
      </div>
    </motion.div>
  );
}
