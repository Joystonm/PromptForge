"use client";
import { useCampaignStore } from "@/store/campaign";
import { StepIndicator } from "@/components/campaign/StepIndicator";
import { IdeaStep } from "@/components/campaign/IdeaStep";
import { PlatformStep } from "@/components/campaign/PlatformStep";
import { AssetTypeStep } from "@/components/campaign/AssetTypeStep";
import { FormatStep } from "@/components/campaign/FormatStep";
import { BriefStep } from "@/components/campaign/BriefStep";
import { GenerateStep } from "@/components/campaign/GenerateStep";
import { ReviewStep } from "@/components/campaign/ReviewStep";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const STEP_COMPONENTS = {
  idea: IdeaStep,
  analysis: IdeaStep,
  platforms: PlatformStep,
  assets: AssetTypeStep,
  formats: FormatStep,
  brief: BriefStep,
  generate: GenerateStep,
  review: ReviewStep,
};

export default function CampaignPage() {
  const { step, error } = useCampaignStore();
  const StepComponent = STEP_COMPONENTS[step] ?? IdeaStep;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">PromptForge AI</span>
          </Link>
          <div className="overflow-x-auto">
            <StepIndicator />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="max-w-2xl mx-auto mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              ⚠️ {error}
            </div>
          )}
          <StepComponent />
        </div>
      </main>
    </div>
  );
}
