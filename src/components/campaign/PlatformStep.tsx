"use client";
import { useCampaignStore } from "@/store/campaign";
import { PLATFORM_META } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Platform } from "@/types/campaign";

const PLATFORMS = Object.keys(PLATFORM_META) as Platform[];

export function PlatformStep() {
  const { selectedPlatforms, togglePlatform, setStep, analysis } = useCampaignStore();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold mb-1">Select Target Platforms</h2>
        <p className="text-gray-400 text-sm">Choose where your campaign will run</p>
        {analysis && (
          <div className="mt-3 glass rounded-xl px-4 py-3 text-sm text-brand-300">
            🏷️ <strong>Brand:</strong> {analysis.brandName} · <strong>Audience:</strong> {analysis.targetAudience} · <strong>Tone:</strong> {analysis.brandTone}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PLATFORMS.map((p) => {
          const meta = PLATFORM_META[p];
          const selected = selectedPlatforms.includes(p);
          return (
            <button
              key={p}
              onClick={() => togglePlatform(p)}
              className={cn(
                "step-card text-center cursor-pointer transition-all",
                selected && "border-brand-500/60 bg-brand-600/10"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mx-auto mb-2 text-lg",
                meta.color
              )}>
                {meta.icon}
              </div>
              <p className="text-sm font-medium">{meta.label}</p>
              {selected && <div className="mt-1 w-2 h-2 rounded-full bg-brand-400 mx-auto" />}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep("idea")}>Back</Button>
        <Button onClick={() => setStep("assets")} disabled={selectedPlatforms.length === 0} className="flex-1 justify-center">
          Continue ({selectedPlatforms.length} selected)
        </Button>
      </div>
    </div>
  );
}
