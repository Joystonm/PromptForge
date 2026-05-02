"use client";
import { useCampaignStore } from "@/store/campaign";
import { FORMATS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { buildCloudinaryUrl } from "@/lib/cloudinary-url";
import { cn } from "@/lib/utils";
import type { Format } from "@/types/campaign";

export function FormatStep() {
  const { selectedPlatforms, selectedAssetTypes, selectedFormats, toggleFormat, setStep, generatedAssets } = useCampaignStore();

  const filtered = FORMATS.filter(
    (f) => selectedPlatforms.includes(f.platform) && selectedAssetTypes.includes(f.assetType)
  );
  const available = filtered.length > 0 ? filtered : FORMATS;

  // Use existing generated image for live preview if available
  const previewPublicId = generatedAssets[0]?.cloudinaryPublicId ?? null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold mb-1">Select Output Formats</h2>
        <p className="text-gray-400 text-sm">
          Choose exact dimensions — each preview is a live Cloudinary transformation
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {available.map((f) => {
          const selected = selectedFormats.some((x) => x.id === f.id);
          return (
            <FormatCard
              key={f.id}
              format={f}
              selected={selected}
              previewPublicId={previewPublicId}
              onToggle={() => toggleFormat(f)}
            />
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep("assets")}>Back</Button>
        <Button onClick={() => setStep("brief")} disabled={selectedFormats.length === 0} className="flex-1 justify-center">
          Generate Creative Brief ({selectedFormats.length} formats)
        </Button>
      </div>
    </div>
  );
}

function FormatCard({ format: f, selected, previewPublicId, onToggle }: {
  format: Format; selected: boolean; previewPublicId: string | null; onToggle: () => void;
}) {
  const ratio = f.width / f.height;
  const previewH = 120;
  const previewW = Math.round(previewH * Math.min(ratio, 2.5));

  return (
    <button
      onClick={onToggle}
      className={cn(
        "step-card text-left cursor-pointer w-full transition-all",
        selected && "border-brand-500/60 bg-brand-600/10"
      )}
    >
      {/* Live Cloudinary preview */}
      <div className="w-full flex items-center justify-center bg-black/30 rounded-lg mb-3 overflow-hidden" style={{ height: 120 }}>
        {previewPublicId ? (
          <img
            src={buildCloudinaryUrl(previewPublicId, f.width, f.height)}
            alt={f.label}
            style={{ width: previewW, height: previewH }}
            className="object-cover rounded"
            loading="lazy"
          />
        ) : (
          <div
            className="bg-white/5 rounded border border-white/10 flex items-center justify-center text-[10px] text-gray-500"
            style={{ width: previewW, height: previewH }}
          >
            {f.width}×{f.height}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{f.label}</p>
          <p className="text-xs text-gray-500">{f.width} × {f.height}px</p>
        </div>
        {selected && <div className="w-2 h-2 rounded-full bg-brand-400 shrink-0" />}
      </div>
      {previewPublicId && (
        <p className="text-[10px] text-brand-400/60 mt-1">⚡ Live Cloudinary transform</p>
      )}
    </button>
  );
}
