import GamePage from "./GamePage";

/* Structured data so search engines (and AI crawlers) know what this page
   actually is, beyond the title/description meta tags. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Forza 4",
  description: "A beautiful, accessible Connect Four game. Play against a friend or vs AI.",
  url: "https://forza4-game.vercel.app",
  applicationCategory: "Game",
  genre: "Board game",
  gamePlatform: "Web Browser",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GamePage />
    </>
  );
}
