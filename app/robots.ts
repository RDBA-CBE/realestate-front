import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/seo.utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/profile",
        "/profile2",
        "/wishlist",
        "/post-property",
        "/compare",
        "/login",
        "/login2",
        "/signin",
        "/signin2",
        "/forgot-password",
        "/forgot-password2",
        "/reset-password/",
        "/verify-email",
        "/change-password-email",
        "/change-password-confirm",
        "/testing",
        "/test",
        "/property-listmv",
        "/property-listv1",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
