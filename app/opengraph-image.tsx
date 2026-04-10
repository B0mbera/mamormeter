import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MámorMéter — 53. Medikus Kupa · Pécs 2026";
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
        {/* Beer emoji */}
        <div style={{ fontSize: 120, marginBottom: 10, display: "flex" }}>🍻</div>

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
          53. Medikus Kupa · Pécs 2026
        </div>

        {/* Date */}
        <div
          style={{
            fontSize: 22,
            color: "#a78bfa",
            marginTop: 8,
            display: "flex",
          }}
        >
          április 9–11.
        </div>

        {/* University badges */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 40,
          }}
        >
          {[
            { id: "DOTE", color: "#16a34a" },
            { id: "POTE", color: "#dc2626" },
            { id: "SOTE", color: "#2563eb" },
            { id: "SZOTE", color: "#7c3aed" },
          ].map((uni) => (
            <div
              key={uni.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: uni.color,
                color: "white",
                fontSize: 24,
                fontWeight: 700,
                padding: "8px 20px",
                borderRadius: 12,
              }}
            >
              {uni.id}
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
          Promille tracker a 4 orvosi egyetem versenyéhez!
        </div>
      </div>
    ),
    { ...size }
  );
}
