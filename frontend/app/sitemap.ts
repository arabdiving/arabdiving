import { MetadataRoute } from "next";

const SITE = "https://arabdiving.com";
const API  = process.env.NEXT_PUBLIC_API_BASE || "https://arabdiving.com";

// ─── Static public pages ──────────────────────────────────────────────────────
const STATIC: MetadataRoute.Sitemap = [
  { url: SITE,                              priority: 1.0,  changeFrequency: "daily"   },
  { url: `${SITE}/dive-sites`,              priority: 0.9,  changeFrequency: "weekly"  },
  { url: `${SITE}/courses`,                 priority: 0.9,  changeFrequency: "weekly"  },
  { url: `${SITE}/trips`,                   priority: 0.9,  changeFrequency: "weekly"  },
  { url: `${SITE}/family-booking`,          priority: 0.9,  changeFrequency: "weekly"  },
  { url: `${SITE}/guide`,                   priority: 0.85, changeFrequency: "monthly" },
  { url: `${SITE}/standards`,               priority: 0.85, changeFrequency: "monthly" },
  { url: `${SITE}/members`,                 priority: 0.8,  changeFrequency: "weekly"  },
  { url: `${SITE}/community`,               priority: 0.8,  changeFrequency: "daily"   },
  { url: `${SITE}/marketplace`,             priority: 0.8,  changeFrequency: "daily"   },
  { url: `${SITE}/stories`,                 priority: 0.8,  changeFrequency: "weekly"  },
  { url: `${SITE}/women`,                   priority: 0.8,  changeFrequency: "monthly" },
  { url: `${SITE}/youth`,                   priority: 0.8,  changeFrequency: "monthly" },
  { url: `${SITE}/kids`,                    priority: 0.8,  changeFrequency: "monthly" },
  { url: `${SITE}/instructors`,             priority: 0.8,  changeFrequency: "weekly"  },
  { url: `${SITE}/explore`,                 priority: 0.75, changeFrequency: "weekly"  },
  { url: `${SITE}/communities`,             priority: 0.75, changeFrequency: "weekly"  },
  { url: `${SITE}/survey`,                  priority: 0.7,  changeFrequency: "monthly" },
  { url: `${SITE}/quiz`,                    priority: 0.7,  changeFrequency: "monthly" },
  { url: `${SITE}/training-fit`,            priority: 0.7,  changeFrequency: "monthly" },
  { url: `${SITE}/try-diving`,              priority: 0.7,  changeFrequency: "monthly" },
  { url: `${SITE}/retreats`,                priority: 0.7,  changeFrequency: "weekly"  },
  { url: `${SITE}/temperatures`,            priority: 0.65, changeFrequency: "monthly" },
  { url: `${SITE}/trends`,                  priority: 0.65, changeFrequency: "weekly"  },
  { url: `${SITE}/weight-calculator`,       priority: 0.65, changeFrequency: "yearly"  },
  { url: `${SITE}/sizes`,                   priority: 0.65, changeFrequency: "yearly"  },
  { url: `${SITE}/logbook`,                 priority: 0.6,  changeFrequency: "weekly"  },
  { url: `${SITE}/game`,                    priority: 0.6,  changeFrequency: "monthly" },
  { url: `${SITE}/travel`,                  priority: 0.6,  changeFrequency: "monthly" },
  { url: `${SITE}/course-standards`,        priority: 0.6,  changeFrequency: "monthly" },
  { url: `${SITE}/suunto-story`,            priority: 0.5,  changeFrequency: "yearly"  },
];

// ─── Helper: fetch JSON safely ────────────────────────────────────────────────
async function safeFetch<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.items ?? data.data ?? data.results ?? []);
  } catch { return []; }
}

// ─── Main sitemap export ──────────────────────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Dive sites
  const diveSites = await safeFetch<{ _id: string; updatedAt?: string }>(
    `${API}/api/dive-sites?limit=500`
  );
  const diveSiteUrls: MetadataRoute.Sitemap = diveSites.map((s) => ({
    url: `${SITE}/dive-sites/${s._id}`,
    lastModified: s.updatedAt ? new Date(s.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // Courses
  const courses = await safeFetch<{ _id: string; updatedAt?: string }>(
    `${API}/api/courses?limit=200`
  );
  const courseUrls: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${SITE}/courses/${c._id}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Instructors
  const instructors = await safeFetch<{ _id: string; updatedAt?: string }>(
    `${API}/api/instructors?limit=200`
  );
  const instructorUrls: MetadataRoute.Sitemap = instructors.map((i) => ({
    url: `${SITE}/instructors/${i._id}`,
    lastModified: i.updatedAt ? new Date(i.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [
    ...STATIC.map((s) => ({ ...s, lastModified: now })),
    ...diveSiteUrls,
    ...courseUrls,
    ...instructorUrls,
  ];
}
