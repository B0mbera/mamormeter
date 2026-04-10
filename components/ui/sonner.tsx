"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        style: {
          borderRadius: "1rem",
          border: "1px solid hsl(var(--border))",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        },
      }}
    />
  );
}
