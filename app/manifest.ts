import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Forza 4",
    short_name: "Forza 4",
    description: "A beautiful, accessible Connect Four game. Play against a friend or vs AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#07080F",
    theme_color: "#07080F",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
