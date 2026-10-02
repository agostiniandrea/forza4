import { ImageResponse } from "next/og";

/* Shared by app/opengraph-image.tsx and app/twitter-image.tsx — both file
   conventions need their own default export + size/contentType/alt, but the
   actual picture only needs to be drawn once. */

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";
export const ogImageAlt = "Forza 4 — a Connect Four game. Red vs gold, four in a row.";

export function renderOgImage() {
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
          background: "#07080F",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,59,59,0.28), transparent 42%), radial-gradient(circle at 80% 85%, rgba(255,215,0,0.22), transparent 42%)",
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          {["#FF3B3B", "#FFD700", "#FF3B3B", "#FFD700"].map((c, i) => (
            <div
              key={i}
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: c,
                boxShadow: `0 0 50px ${c}`,
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: -2,
            color: "#E8F0FF",
            marginTop: 36,
          }}
        >
          FORZA 4
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#7080B0", marginTop: 18 }}>
          Play against a friend or vs AI
        </div>
      </div>
    ),
    { ...ogImageSize },
  );
}
