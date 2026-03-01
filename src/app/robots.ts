import { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cakepanier.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Prevent bots from crawling API routes, admin panels, or Sanity studio
      disallow: ["/api/", "/admin/", "/studio/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
