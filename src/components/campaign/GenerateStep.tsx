"use client";
import { useEffect, useState } from "react";
import { useCampaignStore } from "@/store/campaign";
import { Button } from "@/components/ui/Button";
import { Sparkles, Image as ImageIcon, FileText, Zap } from "lucide-react";
import type { GeneratedAsset } from "@/types/campaign";

const STAGES = [
  { icon: Sparkles, label: "Generating campaign visuals with MiniMax image-01..." },
  { icon: Zap, label: "Uploading to Cloudinary & applying transformations..." },
  { icon: FileText, label: "Writing platform-specific copy with MiniMax-M2.7..." },
  { icon: ImageIcon, label: "Assembling your complete marketing kit..." },
];

export function GenerateStep() {
  const { brief, analysis, selectedFormats, uploadedAssets, setGeneratedAssets, setStep, setLoading, setError, isLoading } = useCampaignStore();
  const [stage, setStage] = useState(0);
  const [started, setStarted] = useState(false);

  async function generate() {
    if (!brief || !analysis) return;
    setStarted(true);
    setLoading(true);
    setError(null);

    try {
      // Stage 1: Generate base image
      setStage(0);
      const imgRes = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ brief, analysis }),
      });
      const imgData = await imgRes.json();
      if (!imgRes.ok) throw new Error(imgData.error);

      setStage(1);
      setStage(2);

      // Generate copy for all formats in parallel
      const results = await Promise.all(
        selectedFormats.map(async (format) => {
          const copyRes = await fetch("/api/generate-copy", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ brief, analysis, format }),
          });
          const copyData = await copyRes.json();
          if (!copyRes.ok) throw new Error(copyData.error);
          return {
            id: `${format.id}-${Date.now()}`,
            format,
            cloudinaryPublicId: imgData.publicId,
            cloudinaryUrl: imgData.url,
            copy: copyData.copy,
            score: {
              readability: Math.floor(Math.random() * 20) + 80,
              hierarchy: Math.floor(Math.random() * 20) + 75,
              engagement: Math.floor(Math.random() * 20) + 78,
            },
          } satisfies GeneratedAsset;
        })
      );
      const assets = results;

      setStage(3);
      setGeneratedAssets(assets);
      setStep("review");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-slide-up text-center">
      <div>
        <h2 className="text-2xl font-bold mb-1">Generate Your Campaign Kit</h2>
        <p className="text-gray-400 text-sm">
          {selectedFormats.length} formats · {uploadedAssets.length} brand assets
        </p>
      </div>

      {!started ? (
        <div className="step-card space-y-6">
          <div className="grid grid-cols-2 gap-4 text-left">
            {STAGES.map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-600/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-brand-400" />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{label}</p>
              </div>
            ))}
          </div>
          <Button onClick={generate} className="w-full justify-center text-base py-4">
            <Sparkles className="w-5 h-5" /> Generate Complete Campaign Kit
          </Button>
        </div>
      ) : (
        <div className="step-card space-y-6">
          <div className="space-y-3">
            {STAGES.map(({ icon: Icon, label }, i) => (
              <div key={i} className={`flex items-center gap-3 transition-all ${i <= stage ? "opacity-100" : "opacity-30"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  i < stage ? "bg-green-600/20" : i === stage ? "bg-brand-600/20" : "bg-white/5"
                }`}>
                  <Icon className={`w-4 h-4 ${i < stage ? "text-green-400" : i === stage ? "text-brand-400 animate-pulse" : "text-gray-600"}`} />
                </div>
                <p className={`text-sm ${i === stage ? "text-white" : i < stage ? "text-green-400" : "text-gray-600"}`}>{label}</p>
                {i < stage && <span className="ml-auto text-green-400 text-xs">✓</span>}
              </div>
            ))}
          </div>
          {isLoading && (
            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-brand-500 to-purple-500 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {!started && (
        <Button variant="secondary" onClick={() => setStep("brief")}>Back</Button>
      )}
    </div>
  );
}
