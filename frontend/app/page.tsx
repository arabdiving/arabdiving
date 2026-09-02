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
import HomeMarketplace from "./components/home/HomeMarketplace";
import RedSeaMap from "./components/RedSeaMap";
import HomeSections from "./components/home/HomeSections";
import FocusHome from "./components/home/FocusHome";
import TestimonialBox from "./components/TestimonialBox";
import { API_BASE } from "./lib/api";
import { ReactNode } from "react";

interface HomeBlock {
  key: string;
  visible: boolean;
  order: number;
}

const DEFAULT_BLOCKS: HomeBlock[] = [
  { key: "hero",              visible: true,  order: 0 },
  { key: "sea_map",           visible: true,  order: 1 },
  { key: "sections_hub",      visible: true,  order: 2 },
  { key: "community_feed",    visible: true,  order: 2 },
  { key: "segments",          visible: true,  order: 3 },
  { key: "dive_centers",      visible: true,  order: 4 },
  { key: "marketplace_grid",  visible: true,  order: 5 },
  { key: "gulf_focus",        visible: true,  order: 6 },
  { key: "stats",             visible: true,  order: 7 },
  { key: "featured_sites",    visible: true,  order: 8 },
  { key: "weight_calculator", visible: false, order: 9 },
  { key: "community_survey",  visible: false, order: 10 },
  { key: "page_cards",        visible: true,  order: 11 },
  { key: "share_box",         visible: false, order: 12 },
];

async function getHomeData(): Promise<{ blocks: HomeBlock[]; promoImages: Record<string, string>; siteMode: string; focusBlocks: HomeBlock[]; shareBoxBrand: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return { blocks: DEFAULT_BLOCKS, promoImages: {}, siteMode: "full", focusBlocks: [], shareBoxBrand: "Suunto" };
    const data = await res.json();
    const siteMode: string = data.settings?.siteMode === "focus" ? "focus" : "full";
    const focusBlocks: HomeBlock[] = data.settings?.focusHomeBlocks || [];
    const shareBoxBrand: string = data.settings?.shareBoxBrand || "Suunto";
    const promoImages: Record<string, string> = data.settings?.promoImages || {};
    const hb: HomeBlock[] = data.settings?.homeBlocks;
    if (hb && hb.length > 0) {
      const dbKeys = new Set(hb.map((b) => b.key));
      const merged = [
        ...hb,
        ...DEFAULT_BLOCKS
          .filter((d) => !dbKeys.has(d.key))
          .map((d) => ({ ...d, order: d.key === "sea_map" ? 0.5 : d.key === "sections_hub" ? 0.6 : hb.length + d.order })),
      ];
      return { blocks: merged.sort((a, b) => a.order - b.order), promoImages, siteMode, focusBlocks, shareBoxBrand };
    }
    return { blocks: DEFAULT_BLOCKS, promoImages, siteMode, focusBlocks, shareBoxBrand };
  } catch {}
  return { blocks: DEFAULT_BLOCKS, promoImages: {}, siteMode: "full", focusBlocks: [], shareBoxBrand: "Suunto" };
}

function renderBlock(key: string, promoImages: Record<string, string> = {}) {
  switch (key) {
    // ─── بلوكات أساسية ───────────────────────────────────────────
    case "hero":               return <Hero key="hero" />;
    case "sea_map":           return <RedSeaMap key="sea_map" embedded />;
    case "sections_hub":      return <HomeSections key="sections_hub" />;
    case "community_feed":    return <HomeCommunityFeed key="community_feed" />;
    case "gulf_focus":        return <GulfFocus key="gulf_focus" />;
    case "stats":             return <Stats key="stats" />;
    case "segments":          return <Community key="segments" />;
    case "dive_centers":      return <HomeDiveCenters key="dive_centers" />;
    case "featured_sites":    return <FeaturedDiveSites key="featured_sites" />;
    case "weight_calculator": return <WeightCalculator key="weight_calculator" />;
    case "community_survey":  return <CommunitySurvey key="community_survey" />;
    case "marketplace_grid":  return <HomeMarketplace key="marketplace_grid" />;
    case "page_cards":        return <HomePageCards key="page_cards" />;
    // ─── بروموشن الصفحات المنفردة ────────────────────────────────
    case "survey_promo":       return <HomePromoSection key="survey_promo" pageKey="survey" image={promoImages["survey_promo"]} />;
    case "courses_promo":      return <HomePromoSection key="courses_promo" pageKey="courses" image={promoImages["courses_promo"]} />;
    case "guide_promo":        return <HomePromoSection key="guide_promo" pageKey="guide" image={promoImages["guide_promo"]} />;
    case "quiz_promo":         return <HomePromoSection key="quiz_promo" pageKey="quiz" image={promoImages["quiz_promo"]} />;
    case "try_diving_promo":   return <HomePromoSection key="try_diving_promo" pageKey="try_diving" image={promoImages["try_diving_promo"]} />;
    case "retreats_promo":     return <HomePromoSection key="retreats_promo" pageKey="retreats" image={promoImages["retreats_promo"]} />;
    case "trips_promo":        return <HomePromoSection key="trips_promo" pageKey="trips" image={promoImages["trips_promo"]} />;
    case "women_promo":        return <HomePromoSection key="women_promo" pageKey="women" image={promoImages["women_promo"]} />;
    case "youth_promo":        return <HomePromoSection key="youth_promo" pageKey="youth" image={promoImages["youth_promo"]} />;
    case "kids_promo":         return <HomePromoSection key="kids_promo" pageKey="kids" image={promoImages["kids_promo"]} />;
    case "logbook_promo":      return <HomePromoSection key="logbook_promo" pageKey="logbook" image={promoImages["logbook_promo"]} />;
    case "marketplace_promo":  return <HomePromoSection key="marketplace_promo" pageKey="marketplace" image={promoImages["marketplace_promo"]} />;
    case "temperatures_promo": return <HomePromoSection key="temperatures_promo" pageKey="temperatures" image={promoImages["temperatures_promo"]} />;
    case "trends_promo":       return <HomePromoSection key="trends_promo" pageKey="trends" image={promoImages["trends_promo"]} />;
    case "weight_calc_promo":  return <HomePromoSection key="weight_calc_promo" pageKey="weight_calc_promo" image={promoImages["weight_calc_promo"]} />;
    case "communities_promo":  return <HomePromoSection key="communities_promo" pageKey="communities" image={promoImages["communities_promo"]} />;
    case "stories_promo":      return <HomePromoSection key="stories_promo" pageKey="stories" image={promoImages["stories_promo"]} />;
    case "dive_sites_promo":   return <HomePromoSection key="dive_sites_promo" pageKey="dive_sites" image={promoImages["dive_sites_promo"]} />;
    case "game_promo":         return <HomePromoSection key="game_promo" pageKey="game" image={promoImages["game_promo"]} />;
    case "family_booking_promo": return <HomePromoSection key="family_booking_promo" pageKey="family_booking" image={promoImages["family_booking_promo"]} />;
    case "sizes_promo":        return <HomePromoSection key="sizes_promo" pageKey="sizes" image={promoImages["sizes_promo"]} />;
    case "members_promo":      return <HomePromoSection key="members_promo" pageKey="members" image={promoImages["members_promo"]} />;
    case "training_fit_promo": return <HomePromoSection key="training_fit_promo" pageKey="training_fit" image={promoImages["training_fit_promo"]} />;
    case "standards_promo":    return <HomePromoSection key="standards_promo" pageKey="standards" image={promoImages["standards_promo"]} />;
    case "travel_promo":       return <HomePromoSection key="travel_promo" pageKey="travel" image={promoImages["travel_promo"]} />;
    case "instructors_promo":  return <HomePromoSection key="instructors_promo" pageKey="instructors" image={promoImages["instructors_promo"]} />;
    default:                   return null;
  }
}

export default async function Home() {
  const { blocks, promoImages, siteMode, focusBlocks, shareBoxBrand } = await getHomeData();
  // وضع «موقع يحل مشكلة»: رئيسية مختصرة ببلوكات مستقلة يتحكم فيها الأدمن
  if (siteMode === "focus") return <FocusHome blocks={focusBlocks as any} promoImages={promoImages} shareBoxBrand={shareBoxBrand} />;
  const visible = blocks.filter((b) => b.visible);
  const out: ReactNode[] = [];
  let run: HomeBlock[] = [];
  const flush = () => {
    if (run.length === 0) return;
    out.push(
      <div key={`promorow-${out.length}`} style={{ maxWidth: "1100px", margin: "0 auto", padding: "38px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "22px" }}>
        {run.map((b) => renderBlock(b.key, promoImages))}
      </div>
    );
    run = [];
  };
  for (const b of visible) {
    if (b.key.endsWith("_promo")) run.push(b);
    else if (b.key === "share_box") {
      flush();
      out.push(
        <section key="share_box" style={{ maxWidth: "820px", margin: "0 auto", padding: "34px 20px" }}>
          <TestimonialBox brand={shareBoxBrand} lang="ar" />
        </section>
      );
    }
    else { flush(); out.push(renderBlock(b.key, promoImages)); }
  }
  flush();
  return <>{out}</>;
}
