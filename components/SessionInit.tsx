"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export function SessionInit() {
  const initDeviceId = useUserStore((s) => s.initDeviceId);

  useEffect(() => {
    initDeviceId();
  }, [initDeviceId]);

  return null;
}
