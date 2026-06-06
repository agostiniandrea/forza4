import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "it", "th"],
  defaultLocale: "en",
  localePrefix: "always",
});
