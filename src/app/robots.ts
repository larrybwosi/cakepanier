import { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cakepanier.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/dealio/catalog/"], // Allow crawling public catalog APIs for rich data if bots use them
      disallow: ["/api/dealio/orders/", "/api/dealio/customers/", "/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
