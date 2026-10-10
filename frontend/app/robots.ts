import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all crawlers to index public pages
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/profile/",
          "/messages/",
          "/my-store/",
          "/change-password/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://arabdiving.com/sitemap.xml",
    host: "https://arabdiving.com",
  };
}
