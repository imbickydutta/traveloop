import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Egypt Vibes — ghoomo world";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#e8b84b";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0a",
          position: "relative",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Gradient orbs */}
        <div style={{
          position: "absolute", top: -120, right: -80,
          width: 560, height: 560, borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT}33 0%, transparent 70%)`,
        }} />
        <div style={{
          position: "absolute", bottom: -160, left: -60,
          width: 480, height: 480, borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT}22 0%, transparent 70%)`,
        }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

        {/* Left accent bar */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: 6, background: ACCENT,
        }} />

        {/* Top: brand */}
        <div style={{
          position: "absolute", top: 48, right: 60,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: ACCENT,
          }} />
          <span style={{
            fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.06em",
          }}>
            ghoomo world
          </span>
        </div>

        {/* Main content */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0 72px 60px",
          display: "flex", flexDirection: "column",
        }}>
          {/* Destination + date pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16, marginBottom: 20,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: `${ACCENT}22`, border: `1px solid ${ACCENT}44`,
              borderRadius: 100, padding: "8px 20px",
            }}>
              <span style={{ fontSize: 22 }}>🇪🇬</span>
              <span style={{
                fontSize: 16, fontWeight: 700, color: ACCENT,
                letterSpacing: "0.18em", textTransform: "uppercase",
              }}>Egypt</span>
            </div>
            <span style={{
              fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              23 Mar – 02 Apr 2025
            </span>
          </div>

          {/* Trip name */}
          <div style={{
            fontSize: 88, fontWeight: 800, lineHeight: 1.0,
            letterSpacing: "-0.02em", color: "white",
            marginBottom: 18,
            display: "flex",
          }}>
            Egypt&nbsp;<span style={{ color: ACCENT, fontStyle: "italic" }}>Vibes</span>
          </div>

          {/* Tagline */}
          <div style={{
            fontSize: 22, color: "rgba(255,255,255,0.65)",
            lineHeight: 1.45, maxWidth: 700, marginBottom: 40,
          }}>
            Pyramids, Nile cruises & the Red Sea — 11 days through the greatest civilisation ever known.
          </div>

          {/* Stats */}
          <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
            {[
              { label: "Duration",      value: "11D · 10N"  },
              { label: "Starting from", value: "₹95,000",   accent: true },
              { label: "Group size",    value: "Max 20"     },
              { label: "Status",        value: "Filling Fast 🔥" },
            ].map((stat, i) => (
              <div key={i} style={{
                display: "flex", flexDirection: "column", gap: 6,
                paddingRight: 40,
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none",
                marginRight: 40,
              }}>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                }}>{stat.label}</span>
                <span style={{
                  fontSize: 20, fontWeight: 700,
                  color: stat.accent ? ACCENT : "white",
                }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
