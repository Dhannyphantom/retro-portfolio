import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/settings";

// Served at /opengraph-image: the fallback share card when no image is uploaded in /admin/profile.
export const alt = "Portfolio preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function OgImage() {
  const s = await getSiteSettings();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#080808",
          color: "#e0e0e0",
          border: "6px solid #2a2a2a",
        }}
      >
        <div style={{ display: "flex", color: "#39ff14", fontSize: 30 }}>{`> ${s.title}`}</div>
        <div style={{ display: "flex", fontSize: 110, fontWeight: 700, marginTop: 20 }}>{s.name}</div>
        <div style={{ display: "flex", fontSize: 32, color: "#8c8c8c", marginTop: 24, maxWidth: 900 }}>
          Mobile · Web · Backend
        </div>
        <div style={{ display: "flex", width: 28, height: 28, background: "#ff0033", marginTop: 40 }} />
      </div>
    ),
    { ...size }
  );
}
