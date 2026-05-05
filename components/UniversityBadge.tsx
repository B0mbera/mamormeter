"use client";

import { getUniversity } from "@/lib/universities";

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

  const uni = getUniversity(universityId);
  if (!uni) return null;

  const s = sizes[size];

  return (
    <div className="flex items-center gap-1">
      <span className={s.emoji}>{uni.emoji}</span>
      {showName && (
        <span className={`${s.text} font-semibold`} style={{ color: uni.color }}>
          {uni.shortName}
        </span>
      )}
    </div>
  );
}
