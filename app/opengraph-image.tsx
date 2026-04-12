import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MámorMéter — Választás 2026 · Április 12.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 50%, #1e1b4b 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Ballot emoji */}
        <div style={{ fontSize: 120, marginBottom: 10, display: "flex" }}>🗳️</div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-2px",
            display: "flex",
          }}
        >
          MámorMéter
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#c4b5fd",
            marginTop: 8,
            display: "flex",
          }}
        >
          Választás 2026 · Április 12.
        </div>

        {/* Party badges */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
          }}
        >
          {[
            { id: "FIDESZ", color: "#f97316" },
            { id: "TISZA", color: "#0ea5e9" },
            { id: "Mi Hazánk", color: "#16a34a" },
            { id: "DK", color: "#1d4ed8" },
            { id: "MKKP", color: "#eab308" },
          ].map((party) => (
            <div
              key={party.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: party.color,
                color: "white",
                fontSize: 22,
                fontWeight: 700,
                padding: "8px 18px",
                borderRadius: 12,
              }}
            >
              {party.id}
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 20,
            color: "#ddd6fe",
            marginTop: 36,
            display: "flex",
          }}
        >
          Promille tracker az 5 parlamenti párt versenyéhez! 🍻
        </div>
      </div>
    ),
    { ...size }
  );
}
