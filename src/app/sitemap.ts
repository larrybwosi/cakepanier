import { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cakepanier.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Define your core static routes
  const staticRoutes = ["", "/menu", "/about", "/contact", "/delivery"].map(
    (route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1.0 : 0.8, // Home page gets highest priority
    }),
  );

  // 2. Fetch dynamic routes (e.g., Products or Categories from Sanity)
  // Example implementation:
  /*
  const products = await client.fetch(`*[_type == "product"]{ "slug": slug.current, _updatedAt }`);
  
  const dynamicRoutes = products.map((product: any) => ({
    url: `${SITE_URL}/product/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  
  return [...staticRoutes, ...dynamicRoutes];
  */

  return [...staticRoutes];
}
