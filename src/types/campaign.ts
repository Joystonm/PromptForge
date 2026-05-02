export type Platform =
  | "instagram" | "linkedin" | "youtube" | "facebook"
  | "twitter" | "website" | "email" | "google_display";

export type AssetType =
  | "social_post" | "story" | "ad_banner" | "hero_banner"
  | "email_header" | "youtube_thumbnail" | "carousel"
  | "promotional_poster" | "product_showcase";

export interface Format {
  id: string;
  label: string;
  width: number;
  height: number;
  platform: Platform;
  assetType: AssetType;
}

export interface CampaignAnalysis {
  brandName: string;
  businessCategory: string;
  productType: string;
  campaignObjective: string;
  targetAudience: string;
  brandTone: string;
  messagingPillars: string[];
}

export interface CreativeBrief {
  brandPositioning: string;
  audiencePersona: string;
  messagingFramework: string;
  campaignTheme: string;
  visualDirection: string;
  colorPalette: string[];
  typographySuggestions: string;
  taglines: string[];
  hooks: string[];
}

export interface GeneratedCopy {
  headline: string;
  caption: string;
  adDescription: string;
  cta: string;
  toneVariations: { tone: string; text: string }[];
}

export interface GeneratedAsset {
  id: string;
  format: Format;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  copy: GeneratedCopy;
  score?: { readability: number; hierarchy: number; engagement: number };
  originalSizeKb?: number;
}

export interface SustainabilityMetrics {
  totalAssets: number;
  sourceAssets: number; // unique publicIds (reuse = totalAssets - sourceAssets)
  estimatedOriginalKb: number;
  estimatedOptimizedKb: number;
  savingsKb: number;
  savingsPct: number;
  co2SavedGrams: number;
  greenScore: number;
  recommendations: string[];
  dprSavingsKb: number;       // extra savings from dpr_auto (avoids over-serving retina images)
  progressiveEnabled: boolean; // fl_progressive for faster perceived load
}

export interface UploadedAsset {
  publicId: string;
  url: string;
  type: "logo" | "product" | "brand" | "reference";
  analysis?: string;
}

export type WorkflowStep =
  | "idea" | "analysis" | "platforms" | "assets"
  | "formats" | "brief" | "generate" | "review";

export interface CampaignState {
  step: WorkflowStep;
  idea: string;
  analysis: CampaignAnalysis | null;
  selectedPlatforms: Platform[];
  selectedAssetTypes: AssetType[];
  selectedFormats: Format[];
  brief: CreativeBrief | null;
  uploadedAssets: UploadedAsset[];
  generatedAssets: GeneratedAsset[];
  isLoading: boolean;
  error: string | null;
}
