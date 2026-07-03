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
import HomePromoSection from "./components/home/HomePromoSection";
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
    // ─── بلوكات أساسية ───────────────────────────────────────────
    case "hero":               return <Hero key="hero" />;
    case "community_feed":    return <HomeCommunityFeed key="community_feed" />;
    case "gulf_focus":        return <GulfFocus key="gulf_focus" />;
    case "stats":             return <Stats key="stats" />;
    case "segments":          return <Community key="segments" />;
    case "dive_centers":      return <HomeDiveCenters key="dive_centers" />;
    case "featured_sites":    return <FeaturedDiveSites key="featured_sites" />;
    case "weight_calculator": return <WeightCalculator key="weight_calculator" />;
    case "community_survey":  return <CommunitySurvey key="community_survey" />;
    case "page_cards":        return <HomePageCards key="page_cards" />;
    // ─── بروموشن الصفحات المنفردة ────────────────────────────────
    case "survey_promo":       return <HomePromoSection key="survey_promo"       pageKey="survey" />;
    case "courses_promo":      return <HomePromoSection key="courses_promo"      pageKey="courses" />;
    case "guide_promo":        return <HomePromoSection key="guide_promo"        pageKey="guide" />;
    case "quiz_promo":         return <HomePromoSection key="quiz_promo"         pageKey="quiz" />;
    case "try_diving_promo":   return <HomePromoSection key="try_diving_promo"   pageKey="try_diving" />;
    case "retreats_promo":     return <HomePromoSection key="retreats_promo"     pageKey="retreats" />;
    case "trips_promo":        return <HomePromoSection key="trips_promo"        pageKey="trips" />;
    case "women_promo":        return <HomePromoSection key="women_promo"        pageKey="women" />;
    case "youth_promo":        return <HomePromoSection key="youth_promo"        pageKey="youth" />;
    case "kids_promo":         return <HomePromoSection key="kids_promo"         pageKey="kids" />;
    case "logbook_promo":      return <HomePromoSection key="logbook_promo"      pageKey="logbook" />;
    case "marketplace_promo":  return <HomePromoSection key="marketplace_promo"  pageKey="marketplace" />;
    case "temperatures_promo": return <HomePromoSection key="temperatures_promo" pageKey="temperatures" />;
    case "trends_promo":       return <HomePromoSection key="trends_promo"       pageKey="trends" />;
    case "weight_calc_promo":  return <HomePromoSection key="weight_calc_promo"  pageKey="weight_calc_promo" />;
    case "communities_promo":  return <HomePromoSection key="communities_promo"  pageKey="communities" />;
    case "stories_promo":      return <HomePromoSection key="stories_promo"      pageKey="stories" />;
    case "dive_sites_promo":   return <HomePromoSection key="dive_sites_promo"   pageKey="dive_sites" />;
    case "game_promo":         return <HomePromoSection key="game_promo"         pageKey="game" />;
    case "family_booking_promo": return <HomePromoSection key="family_booking_promo" pageKey="family_booking" />;
    case "sizes_promo":        return <HomePromoSection key="sizes_promo"        pageKey="sizes" />;
    case "members_promo":      return <HomePromoSection key="members_promo"      pageKey="members" />;
    case "training_fit_promo": return <HomePromoSection key="training_fit_promo" pageKey="training_fit" />;
    case "standards_promo":    return <HomePromoSection key="standards_promo"    pageKey="standards" />;
    default:                   return null;
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
