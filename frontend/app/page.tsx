import Hero from "./components/home/Hero";
import GulfFocus from "./components/home/GulfFocus";
import Stats from "./components/home/Stats";
import FeaturedDiveSites from "./components/home/FeaturedDiveSites";
import HomeDiveCenters from "./components/home/HomeDiveCenters";
import Community from "./components/home/Community";
import HomeCommunityFeed from "./components/home/HomeCommunityFeed";
import { API_BASE } from "./lib/api";

interface HomeBlock {
  key: string;
  visible: boolean;
  order: number;
}

const DEFAULT_BLOCKS: HomeBlock[] = [
  { key: "hero",           visible: true, order: 0 },
  { key: "community_feed", visible: true, order: 1 },
  { key: "gulf_focus",     visible: true, order: 2 },
  { key: "stats",          visible: true, order: 3 },
  { key: "segments",       visible: true, order: 4 },
  { key: "dive_centers",   visible: true, order: 5 },
  { key: "featured_sites", visible: true, order: 6 },
];

async function getHomeBlocks(): Promise<HomeBlock[]> {
  try {
    const res = await fetch(`${API_BASE}/api/settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return DEFAULT_BLOCKS;
    const data = await res.json();
    const hb: HomeBlock[] = data.settings?.homeBlocks;
    if (hb && hb.length > 0) return [...hb].sort((a, b) => a.order - b.order);
  } catch {}
  return DEFAULT_BLOCKS;
}

function renderBlock(key: string) {
  switch (key) {
    case "hero":           return <Hero key="hero" />;
    case "community_feed": return <HomeCommunityFeed key="community_feed" />;
    case "gulf_focus":     return <GulfFocus key="gulf_focus" />;
    case "stats":          return <Stats key="stats" />;
    case "segments":       return <Community key="segments" />;
    case "dive_centers":   return <HomeDiveCenters key="dive_centers" />;
    case "featured_sites": return <FeaturedDiveSites key="featured_sites" />;
    default:               return null;
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
