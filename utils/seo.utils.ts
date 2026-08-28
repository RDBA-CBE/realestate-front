import { BASEURL } from "@/utils/constant.utils";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.boomrealtys.com";

export const titleFromSlug = (slug = "") =>
  decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();

export const getPropertyPathValue = (property: any) =>
  property?.slug || property?.id || "";

export const getPropertyUrl = (property: any) =>
  `${SITE_URL}/property-list/${getPropertyPathValue(property)}`;

export async function fetchPropertyDetail(slug: string) {
  if (!slug) return null;

  try {
    const propertyUrl = `https://www.boomrealtys.com/property-list/${slug}`;
    const res = await fetch(
      `${BASEURL}properties/?page=1&is_approved=true&publish=true&page_size=1&property_url=${encodeURIComponent(propertyUrl)}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.results?.[0] || null;
  } catch {
    return null;
  }
}

export async function fetchSeoProperties(pageSize = 100) {
  try {
    const res = await fetch(
      `${BASEURL}properties?page=1&is_approved=true&publish=true&page_size=${pageSize}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data?.results || [];
  } catch {
    return [];
  }
}
