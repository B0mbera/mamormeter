"use client";

import { getParty } from "@/lib/constants";

interface UniversityBadgeProps {
  universityId: string | null | undefined;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

const sizes = {
  sm: { emoji: "text-sm", text: "text-[10px]" },
  md: { emoji: "text-base", text: "text-xs" },
  lg: { emoji: "text-xl", text: "text-sm" },
};

export function UniversityBadge({
  universityId,
  size = "sm",
  showName = true,
}: UniversityBadgeProps) {
  if (!universityId) return null;

  const party = getParty(universityId);
  if (!party) return null;

  const s = sizes[size];

  return (
    <div className="flex items-center gap-1">
      <span className={s.emoji}>{party.emoji}</span>
      {showName && (
        <span className={`${s.text} font-semibold`} style={{ color: party.color }}>
          {party.name}
        </span>
      )}
    </div>
  );
}
