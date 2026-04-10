"use client";

import Image from "next/image";
import { getUniversity } from "@/lib/constants";

interface UniversityBadgeProps {
  universityId: string | null | undefined;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

const sizes = {
  sm: { img: 16, text: "text-[10px]" },
  md: { img: 20, text: "text-xs" },
  lg: { img: 28, text: "text-sm" },
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
      <Image
        src={uni.logo}
        alt={uni.name}
        width={s.img}
        height={s.img}
        className="rounded-sm object-contain"
      />
      {showName && (
        <span className={`${s.text} font-semibold`} style={{ color: uni.color }}>
          {uni.id}
        </span>
      )}
    </div>
  );
}
