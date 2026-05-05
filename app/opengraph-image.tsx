import { ImageResponse } from "next/og";
import { TOP_UNIVERSITIES } from "@/lib/universities";

export const runtime = "edge";
export const alt = "EFOTT Ivásszámláló — EFOTT 2026 · Velencei-tó";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const featured = TOP_UNIVERSITIES.slice(0, 5);

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
        {/* Festival tent emoji */}
        <div style={{ fontSize: 120, marginBottom: 10, display: "flex" }}>🎪</div>

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
          EFOTT Ivásszámláló
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
          EFOTT 2026 · Velencei-tó
        </div>

        {/* University badges */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
          }}
        >
          {featured.map((u) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: u.color,
                color: "white",
                fontSize: 22,
                fontWeight: 700,
                padding: "8px 18px",
                borderRadius: 12,
              }}
            >
              {u.shortName}
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
          Versenyezz az egyetemed színeiben! 🍻
        </div>
      </div>
    ),
    { ...size }
  );
}
