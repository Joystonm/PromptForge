import type { Format, Platform, AssetType } from "@/types/campaign";

export const FORMATS: Format[] = [
  { id: "ig_post", label: "Instagram Post", width: 1080, height: 1080, platform: "instagram", assetType: "social_post" },
  { id: "ig_story", label: "Instagram Story", width: 1080, height: 1920, platform: "instagram", assetType: "story" },
  { id: "ig_carousel", label: "Instagram Carousel", width: 1080, height: 1080, platform: "instagram", assetType: "carousel" },
  { id: "li_banner", label: "LinkedIn Banner", width: 1584, height: 396, platform: "linkedin", assetType: "hero_banner" },
  { id: "li_post", label: "LinkedIn Post", width: 1200, height: 627, platform: "linkedin", assetType: "social_post" },
  { id: "yt_thumb", label: "YouTube Thumbnail", width: 1280, height: 720, platform: "youtube", assetType: "youtube_thumbnail" },
  { id: "fb_ad", label: "Facebook Ad", width: 1200, height: 628, platform: "facebook", assetType: "ad_banner" },
  { id: "tw_post", label: "X/Twitter Post", width: 1600, height: 900, platform: "twitter", assetType: "social_post" },
  { id: "web_hero", label: "Website Hero Banner", width: 1920, height: 600, platform: "website", assetType: "hero_banner" },
  { id: "email_header", label: "Email Header", width: 600, height: 200, platform: "email", assetType: "email_header" },
  { id: "gdn_leaderboard", label: "Google Leaderboard", width: 728, height: 90, platform: "google_display", assetType: "ad_banner" },
  { id: "gdn_rectangle", label: "Google Rectangle", width: 300, height: 250, platform: "google_display", assetType: "ad_banner" },
];

export const PLATFORM_META: Record<Platform, { label: string; icon: string; color: string }> = {
  instagram: { label: "Instagram", icon: "📸", color: "from-pink-500 to-purple-600" },
  linkedin: { label: "LinkedIn", icon: "💼", color: "from-blue-600 to-blue-700" },
  youtube: { label: "YouTube", icon: "▶️", color: "from-red-500 to-red-600" },
  facebook: { label: "Facebook", icon: "👥", color: "from-blue-500 to-blue-600" },
  twitter: { label: "X / Twitter", icon: "𝕏", color: "from-gray-700 to-gray-800" },
  website: { label: "Website", icon: "🌐", color: "from-teal-500 to-cyan-600" },
  email: { label: "Email", icon: "✉️", color: "from-amber-500 to-orange-600" },
  google_display: { label: "Google Display", icon: "🎯", color: "from-green-500 to-emerald-600" },
};

export const ASSET_TYPE_META: Record<AssetType, { label: string; icon: string }> = {
  social_post: { label: "Social Post", icon: "🖼️" },
  story: { label: "Story", icon: "📱" },
  ad_banner: { label: "Ad Banner", icon: "📢" },
  hero_banner: { label: "Hero Banner", icon: "🏆" },
  email_header: { label: "Email Header", icon: "✉️" },
  youtube_thumbnail: { label: "YouTube Thumbnail", icon: "▶️" },
  carousel: { label: "Carousel", icon: "🎠" },
  promotional_poster: { label: "Promo Poster", icon: "🎨" },
  product_showcase: { label: "Product Showcase", icon: "✨" },
};

export const WORKFLOW_STEPS = [
  { id: "idea", label: "Campaign Idea" },
  { id: "platforms", label: "Platforms" },
  { id: "assets", label: "Asset Types" },
  { id: "formats", label: "Formats" },
  { id: "brief", label: "Creative Brief" },
  { id: "generate", label: "Generate" },
  { id: "review", label: "Review & Export" },
] as const;
