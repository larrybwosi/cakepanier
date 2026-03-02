import { MetadataRoute } from "next";
import { getCatalogProducts } from "@/lib/dealio/catalog";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cakepanier.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Define your core static routes
  const staticRoutes = ["", "/products", "/cart", "/auth"].map(
    (route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1.0 : 0.8, // Home page gets highest priority
    }),
  );

  // 2. Fetch dynamic product routes from Dealio
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const productsRes = await getCatalogProducts({ limit: 100 });
    if (productsRes.products) {
      dynamicRoutes = productsRes.products.map((product) => ({
        url: `${SITE_URL}/products/${product.id}`,
        lastModified: new Date(), // Could be updated if product has updatedAt
        changeFrequency: "daily" as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.error("[sitemap] Failed to fetch products:", err);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
