import Hero from "./components/home/Hero";
import GulfFocus from "./components/home/GulfFocus";
import Stats from "./components/home/Stats";
import FeaturedDiveSites from "./components/home/FeaturedDiveSites";
import HomeDiveCenters from "./components/home/HomeDiveCenters";
import Community from "./components/home/Community";
import HomeCommunityFeed from "./components/home/HomeCommunityFeed";
import WeightCalculator from "./components/home/WeightCalculator";
import CommunitySurvey from "./components/home/CommunitySurvey";
import HomePageCards from "./components/home/HomePageCards";
import { API_BASE } from "./lib/api";

interface HomeBlock {
  key: string;
  visible: boolean;
  order: number;
}

const DEFAULT_BLOCKS: HomeBlock[] = [
  { key: "hero",              visible: true,  order: 0 },
  { key: "community_feed",    visible: true,  order: 1 },
  { key: "gulf_focus",        visible: true,  order: 2 },
  { key: "stats",             visible: true,  order: 3 },
  { key: "segments",          visible: true,  order: 4 },
  { key: "dive_centers",      visible: true,  order: 5 },
  { key: "featured_sites",    visible: true,  order: 6 },
  { key: "weight_calculator", visible: false, order: 7 },
  { key: "community_survey",  visible: false, order: 8 },
  { key: "page_cards",        visible: true,  order: 9 },
];

async function getHomeBlocks(): Promise<HomeBlock[]> {
  try {
    const res = await fetch(`${API_BASE}/api/settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return DEFAULT_BLOCKS;
    const data = await res.json();
    const hb: HomeBlock[] = data.settings?.homeBlocks;
    if (hb && hb.length > 0) {
      // Merge: ensure all DEFAULT_BLOCKS keys exist (hidden if new)
      const dbKeys = new Set(hb.map((b) => b.key));
      const merged = [
        ...hb,
        ...DEFAULT_BLOCKS
          .filter((d) => !dbKeys.has(d.key))
          .map((d) => ({ ...d, order: hb.length + d.order })),
      ];
      return merged.sort((a, b) => a.order - b.order);
    }
  } catch {}
  return DEFAULT_BLOCKS;
}

function renderBlock(key: string) {
  switch (key) {
    case "hero":              return <Hero key="hero" />;
    case "community_feed":   return <HomeCommunityFeed key="community_feed" />;
    case "gulf_focus":       return <GulfFocus key="gulf_focus" />;
    case "stats":            return <Stats key="stats" />;
    case "segments":         return <Community key="segments" />;
    case "dive_centers":     return <HomeDiveCenters key="dive_centers" />;
    case "featured_sites":   return <FeaturedDiveSites key="featured_sites" />;
    case "weight_calculator":return <WeightCalculator key="weight_calculator" />;
    case "community_survey": return <CommunitySurvey key="community_survey" />;
    case "page_cards":       return <HomePageCards key="page_cards" />;
    default:                 return null;
  }
}

export default async function Home() {
  const blocks = await getHomeBlocks();
  return (
    <>
      {blocks.filter((b) => b.visible).map((b) => renderBlock(b.key))}
    </>
  );
}
