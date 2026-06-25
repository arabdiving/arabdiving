"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "./lib/api";
import Hero from "./components/home/Hero";
import GulfFocus from "./components/home/GulfFocus";
import Stats from "./components/home/Stats";
import FeaturedDiveSites from "./components/home/FeaturedDiveSites";
import Community from "./components/home/Community";
import HomeCommunityFeed from "./components/home/HomeCommunityFeed";

interface HomeBlock {
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

const DEFAULT_BLOCKS: HomeBlock[] = [
  { key: "hero",           label: "hero",           visible: true, order: 0 },
  { key: "community_feed", label: "community_feed", visible: true, order: 1 },
  { key: "gulf_focus",     label: "gulf_focus",     visible: true, order: 2 },
  { key: "stats",          label: "stats",          visible: true, order: 3 },
  { key: "segments",       label: "segments",       visible: true, order: 4 },
  { key: "featured_sites", label: "featured_sites", visible: true, order: 5 },
];

function renderBlock(key: string) {
  switch (key) {
    case "hero":           return <Hero key="hero" />;
    case "community_feed": return <HomeCommunityFeed key="community_feed" />;
    case "gulf_focus":     return <GulfFocus key="gulf_focus" />;
    case "stats":          return <Stats key="stats" />;
    case "segments":       return <Community key="segments" />;
    case "featured_sites": return <FeaturedDiveSites key="featured_sites" />;
    default:               return null;
  }
}

export default function Home() {
  const [blocks, setBlocks] = useState<HomeBlock[]>(DEFAULT_BLOCKS);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => {
        const hb: HomeBlock[] = d.settings?.homeBlocks;
        if (hb && hb.length > 0) {
          setBlocks([...hb].sort((a, b) => a.order - b.order));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {blocks
        .filter((b) => b.visible)
        .sort((a, b) => a.order - b.order)
        .map((b) => renderBlock(b.key))}
    </>
  );
}
