"use client";

import React, { useState } from "react";
import { Maximize2, Minimize2, Star, X } from "lucide-react";
import { motion } from "framer-motion";

export default function PanelHeader({
  team,
  onClose,
  isExpanded,
  onToggleExpand,
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="relative px-5 pb-4 pt-5">
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg p-2"
          style={{ background: `${team.color}20` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={team.logo}
            alt={team.name}
            className="h-full w-full object-contain"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </motion.div>

        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
            Arena Guide
          </p>
          <motion.h2
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg"
          >
            {team.name}
          </motion.h2>
          <motion.p
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-0.5 truncate text-xs font-medium text-muted-foreground sm:text-sm"
          >
            {team.arena}
          </motion.p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFavorite(!isFavorite)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="rounded-md p-2 transition-colors hover:bg-secondary"
            type="button"
          >
            <Star
              className={`h-4 w-4 transition-colors ${
                isFavorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleExpand}
            aria-label={isExpanded ? "Collapse side panel" : "Expand side panel"}
            title={isExpanded ? "Collapse side panel" : "Expand side panel"}
            className="hidden rounded-md p-2 transition-colors hover:bg-secondary md:flex"
            type="button"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Maximize2 className="h-4 w-4 text-muted-foreground" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            aria-label="Close arena details"
            title="Close arena details"
            className="rounded-md p-2 transition-colors hover:bg-secondary"
            type="button"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
