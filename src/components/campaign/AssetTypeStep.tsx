"use client";
import { useCampaignStore } from "@/store/campaign";
import { ASSET_TYPE_META } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { AssetType } from "@/types/campaign";

const ASSET_TYPES = Object.keys(ASSET_TYPE_META) as AssetType[];

export function AssetTypeStep() {
  const { selectedAssetTypes, toggleAssetType, setStep } = useCampaignStore();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold mb-1">Select Asset Types</h2>
        <p className="text-gray-400 text-sm">What kinds of creatives do you need?</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ASSET_TYPES.map((a) => {
          const meta = ASSET_TYPE_META[a];
          const selected = selectedAssetTypes.includes(a);
          return (
            <button
              key={a}
              onClick={() => toggleAssetType(a)}
              className={cn(
                "step-card text-left cursor-pointer transition-all",
                selected && "border-brand-500/60 bg-brand-600/10"
              )}
            >
              <span className="text-2xl mb-2 block">{meta.icon}</span>
              <p className="text-sm font-medium">{meta.label}</p>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep("platforms")}>Back</Button>
        <Button onClick={() => setStep("formats")} disabled={selectedAssetTypes.length === 0} className="flex-1 justify-center">
          Continue ({selectedAssetTypes.length} selected)
        </Button>
      </div>
    </div>
  );
}
