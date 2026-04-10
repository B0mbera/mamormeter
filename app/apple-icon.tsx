import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 120,
        }}
      >
        🍻
      </div>
    ),
    { ...size }
  );
}
