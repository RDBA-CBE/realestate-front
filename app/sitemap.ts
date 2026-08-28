import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/seo.utils";
import { BASEURL } from "@/utils/constant.utils";

async function fetchPropertyUrls(): Promise<
  { url: string; updated_at: string }[]
> {
  try {
    const res = await fetch(`${BASEURL}properties/property_urls/`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    return await res.json();
  } catch {
    return [];
  }
}

/**
 * Validate sitemap URLs
 */
function isValidSitemapUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    const siteHostname = new URL(SITE_URL).hostname;

    // Allow site domain, production domain, and www subdomain
    if (
      url.hostname !== "boomrealtys.com" &&
      url.hostname !== "www.boomrealtys.com" &&
      url.hostname !== siteHostname
    ) {
      return false;
    }

    // Don't allow query params
    if (url.search) return false;

    // Don't allow private routes
    const blockedPrefixes = [
      "/admin",
      "/login",
      "/login2",
      "/signin",
      "/signin2",
      "/dashboard",
      "/profile",
      "/profile2",
      "/wishlist",
      "/post-property",
      "/saved-properties",
      "/forgot-password",
      "/forgot-password2",
      "/reset-password",
      "/testing",
      "/test",
    ];

    if (blockedPrefixes.some((route) => url.pathname.startsWith(route))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const propertyUrls = await fetchPropertyUrls();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/home`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/property-list`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const seen = new Set<string>();

  const dynamicRoutes: MetadataRoute.Sitemap = propertyUrls
    .filter((item) => {
      if (!item?.url) return false;

      const normalizedUrl = item.url.replace(
        "https://boomrealtys.com",
        SITE_URL
      );

      if (!isValidSitemapUrl(normalizedUrl)) return false;

      if (seen.has(normalizedUrl)) return false;

      seen.add(normalizedUrl);

      return true;
    })
    .map((item) => {
      const normalizedUrl = item.url.replace(
        "https://boomrealtys.com",
        SITE_URL
      );

      return {
        url: normalizedUrl,
        lastModified: item.updated_at
          ? new Date(item.updated_at)
          : new Date(),
        changeFrequency: "daily" as const,
        priority: normalizedUrl.includes("/property-list/") || normalizedUrl.includes("/property/")
          ? 0.9
          : normalizedUrl.includes("/projects/") || normalizedUrl.includes("/project/")
          ? 0.85
          : normalizedUrl.includes("/developers/") || normalizedUrl.includes("/developer/")
          ? 0.8
          : 0.75,
      };
    });

  return [...staticRoutes, ...dynamicRoutes];
}
