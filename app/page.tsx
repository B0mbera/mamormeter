"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function HomePage() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);

  useEffect(() => {
    if (userId) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [userId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <span className="text-4xl">🍻</span>
        <p className="text-sm text-muted-foreground mt-2">MámorMéter</p>
      </div>
    </div>
  );
}
