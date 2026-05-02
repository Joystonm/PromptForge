"use client";
import { useState } from "react";
import { useCampaignStore } from "@/store/campaign";
import { Button } from "@/components/ui/Button";
import { buildCloudinaryUrl, buildSrcSet } from "@/lib/cloudinary-url";
import { ComparisonSlider } from "./ComparisonSlider";
import { SustainabilityDashboard } from "./SustainabilityDashboard";
import { CloudinaryStudio } from "./CloudinaryStudio";
import { Download, RefreshCw, Star, LayoutGrid, Sliders, Leaf, Wand2 } from "lucide-react";
import type { GeneratedAsset } from "@/types/campaign";

type Tab = "gallery" | "compare" | "impact" | "studio";

export function ReviewStep() {
  const { generatedAssets, brief, reset } = useCampaignStore();
  const [selected, setSelected] = useState<GeneratedAsset | null>(generatedAssets[0] ?? null);
  const [tab, setTab] = useState<Tab>("gallery");

  const firstAsset = generatedAssets[0];

  function downloadAsset(asset: GeneratedAsset) {
    const url = buildCloudinaryUrl(asset.cloudinaryPublicId, asset.format.width, asset.format.height);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${asset.format.id}.jpg`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const tabs = [
    { id: "gallery" as Tab, label: "Platform Gallery", icon: LayoutGrid },
    { id: "compare" as Tab, label: "Optimization", icon: Sliders },
    { id: "studio" as Tab, label: "Studio", icon: Wand2 },
    { id: "impact" as Tab, label: "Green Impact", icon: Leaf },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Your Campaign Kit is Ready 🎉</h2>
          <p className="text-gray-400 text-sm">{generatedAssets.length} assets · powered by Cloudinary</p>
        </div>
        <Button variant="secondary" onClick={reset} className="text-sm">
          <RefreshCw className="w-4 h-4" /> New Campaign
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-xl p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id ? "bg-brand-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Tab: Platform Gallery */}
      {tab === "gallery" && (
        <div className="space-y-6">
          {/* One-click resize gallery — all formats from one publicId */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {generatedAssets.map((asset) => {
              const ratio = asset.format.width / asset.format.height;
              const thumbH = 140;
              const thumbW = Math.round(thumbH * Math.min(ratio, 2));
              const isSelected = selected?.id === asset.id;
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelected(asset)}
                  className={`step-card flex flex-col items-center gap-2 cursor-pointer transition-all ${
                    isSelected ? "border-brand-500/60 bg-brand-600/10" : ""
                  }`}
                >
                  <div className="w-full flex items-center justify-center bg-black/30 rounded-lg overflow-hidden" style={{ height: thumbH }}>
                    <img
                      src={buildCloudinaryUrl(asset.cloudinaryPublicId, asset.format.width, asset.format.height)}
                      srcSet={buildSrcSet(asset.cloudinaryPublicId, asset.format.height, [240, 480, thumbW * 2])}
                      sizes={`${thumbW}px`}
                      alt={asset.format.label}
                      style={{ width: thumbW, height: thumbH }}
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-xs font-medium truncate">{asset.format.label}</p>
                    <p className="text-[10px] text-gray-500">{asset.format.width}×{asset.format.height}</p>
                    {asset.score && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] text-amber-400">
                          {Math.round((asset.score.readability + asset.score.hierarchy + asset.score.engagement) / 3)}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); downloadAsset(asset); }}
                    className="w-full flex items-center justify-center gap-1 text-[10px] text-brand-400 hover:text-brand-300 transition-colors py-1"
                  >
                    <Download className="w-3 h-3" /> Download
                  </button>
                </div>
              );
            })}
          </div>

          {/* Selected asset detail */}
          {selected && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="step-card">
                <div className="aspect-video bg-black/30 rounded-xl overflow-hidden flex items-center justify-center mb-4">
                  <img
                    src={buildCloudinaryUrl(selected.cloudinaryPublicId, selected.format.width, selected.format.height)}
                    alt={selected.format.label}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Headline</p>
                    <p className="font-semibold">{selected.copy.headline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">CTA</p>
                    <p className="font-semibold text-brand-400">{selected.copy.cta}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Caption</p>
                    <p className="text-gray-300 text-xs">{selected.copy.caption}</p>
                  </div>
                </div>
                <Button onClick={() => downloadAsset(selected)} className="w-full justify-center">
                  <Download className="w-4 h-4" /> Download {selected.format.label}
                </Button>
              </div>

              <div className="space-y-4">
                {selected.score && (
                  <div className="step-card grid grid-cols-3 gap-3 text-center">
                    {[
                      { label: "Readability", val: selected.score.readability },
                      { label: "Hierarchy", val: selected.score.hierarchy },
                      { label: "Engagement", val: selected.score.engagement },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <div className="text-2xl font-bold text-brand-400">{val}</div>
                        <div className="text-xs text-gray-500">{label}</div>
                      </div>
                    ))}
                  </div>
                )}
                {brief && selected.copy.toneVariations?.length > 0 && (
                  <div className="step-card">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Tone Variations</p>
                    <div className="space-y-2">
                      {selected.copy.toneVariations.map((v, i) => (
                        <div key={i} className="flex gap-2 text-sm">
                          <span className="text-brand-400 font-medium shrink-0">{v.tone}:</span>
                          <span className="text-gray-300">{v.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="step-card text-xs text-gray-500 space-y-1">
                  <p className="text-brand-400 font-medium text-sm mb-2">⚡ Cloudinary Powers This</p>
                  <p>• One <code className="text-brand-300">{firstAsset?.cloudinaryPublicId}</code></p>
                  <p>• {generatedAssets.length} unique transformation URLs</p>
                  <p>• f_auto · q_auto · c_fill · g_auto · dpr_auto</p>
                  <p>• fl_progressive · Responsive srcset</p>
                  <p>• Zero re-generation — pure URL transforms</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Optimization Comparison */}
      {tab === "compare" && firstAsset && (
        <div className="max-w-2xl space-y-4">
          <p className="text-sm text-gray-400">
            Drag the slider to compare the raw image vs. Cloudinary's auto-optimized WebP delivery.
          </p>
          <ComparisonSlider
            publicId={firstAsset.cloudinaryPublicId}
            width={firstAsset.format.width}
            height={firstAsset.format.height}
            originalSizeKb={2400}
          />
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Format", before: "JPG/PNG", after: "WebP (auto)" },
              { label: "Quality", before: "Original", after: "q_auto" },
              { label: "Delivery", before: "Origin server", after: "Global CDN" },
            ].map(({ label, before, after }) => (
              <div key={label} className="step-card text-center">
                <p className="text-xs text-gray-500 mb-2">{label}</p>
                <p className="text-xs text-red-400 line-through">{before}</p>
                <p className="text-xs text-green-400 font-medium">{after}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Cloudinary Studio */}
      {tab === "studio" && firstAsset && (
        <div className="max-w-3xl">
          <CloudinaryStudio asset={firstAsset} />
        </div>
      )}

      {/* Tab: Green Impact */}
      {tab === "impact" && (
        <div className="max-w-3xl">
          <SustainabilityDashboard assets={generatedAssets} />
        </div>
      )}

    </div>
  );
}
