import type { GeneratedAsset, SustainabilityMetrics } from "@/types/campaign";

// Cloudinary typically achieves 70-85% reduction with f_auto + q_auto
const COMPRESSION_RATIO = 0.18;
// ~0.0006 grams CO₂ per KB transferred (based on avg grid intensity + data center PUE)
const CO2_GRAMS_PER_KB = 0.0006;

export function computeSustainabilityMetrics(assets: GeneratedAsset[]): SustainabilityMetrics {
  const uniquePublicIds = new Set(assets.map((a) => a.cloudinaryPublicId));
  const sourceAssets = uniquePublicIds.size;
  const totalAssets = assets.length;

  // Use real sizes if available, otherwise estimate ~2MB per unique source image
  const estimatedOriginalKb = assets.reduce((sum, a) => sum + (a.originalSizeKb ?? 2048), 0) / Math.max(totalAssets, 1) * sourceAssets;
  const estimatedOptimizedKb = Math.round(estimatedOriginalKb * COMPRESSION_RATIO);
  const savingsKb = estimatedOriginalKb - estimatedOptimizedKb;
  const savingsPct = Math.round((savingsKb / estimatedOriginalKb) * 100);
  const co2SavedGrams = Math.round(savingsKb * CO2_GRAMS_PER_KB * 1000) / 1000;

  // Additional savings from dpr_auto: avoids serving 2x/3x images to 1x screens (~30% extra bytes)
  const dprSavingsKb = Math.round(estimatedOptimizedKb * 0.3);
  // Progressive JPEG: ~10% faster perceived load (not byte savings, but UX impact)
  const progressiveEnabled = true;

  // Green Score (0–100)
  const compressionScore = Math.min(40, Math.round((savingsPct / 100) * 40));
  const reuseScore = Math.min(30, Math.round(((totalAssets - sourceAssets) / Math.max(totalAssets, 1)) * 30));
  const formatScore = 20; // f_auto always picks WebP/AVIF
  const cdnScore = 5;    // always CDN-delivered
  const dprScore = 5;    // dpr_auto prevents over-serving high-res to low-DPR screens
  const greenScore = compressionScore + reuseScore + formatScore + cdnScore + dprScore;

  const recommendations: string[] = [];
  if (reuseScore < 20) recommendations.push("Upload fewer source assets — let Cloudinary transforms do the work.");
  if (savingsPct < 70) recommendations.push("Enable AVIF delivery for an additional 20% size reduction.");
  if (totalAssets < 4) recommendations.push("Generate more format variants to maximize asset reuse efficiency.");
  if (sourceAssets > 1) recommendations.push("Use a single source image with URL transforms to eliminate redundant uploads.");
  if (recommendations.length === 0) recommendations.push("Excellent! Your campaign is fully optimized for sustainable delivery.");

  return {
    totalAssets,
    sourceAssets,
    estimatedOriginalKb,
    estimatedOptimizedKb,
    savingsKb,
    savingsPct,
    co2SavedGrams,
    greenScore,
    recommendations,
    dprSavingsKb,
    progressiveEnabled,
  };
}
