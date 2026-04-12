"use client";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <p className="text-4xl">😵</p>
        <p className="text-sm text-muted-foreground">Hiba történt / Something went wrong</p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm"
        >
          Újra / Retry
        </button>
      </div>
    </div>
  );
}
