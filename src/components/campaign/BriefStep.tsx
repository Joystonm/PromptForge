"use client";
import { useEffect } from "react";
import { useCampaignStore } from "@/store/campaign";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Sparkles, Leaf } from "lucide-react";

const ECO_COPY_TIPS = [
  "Keep headlines under 8 words — shorter copy loads faster and converts better.",
  "Use one strong CTA per asset instead of multiple — reduces cognitive load and page weight.",
  "Prefer SVG icons over raster images for UI elements — infinitely scalable, near-zero bytes.",
  "Avoid embedding fonts in images — use Cloudinary text overlays instead (zero extra file size).",
  "Reuse one tagline across platforms with URL transforms rather than generating new copy per format.",
];

export function BriefStep() {
  const { idea, analysis, brief, setBrief, setStep, setLoading, setError, isLoading } = useCampaignStore();

  useEffect(() => {
    if (!brief && analysis) generateBrief();
  }, []);

  async function generateBrief() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-brief", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idea, analysis }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBrief(data.brief);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Brief generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Creative Brief</h2>
          <p className="text-gray-400 text-sm">AI-generated strategy for your campaign</p>
        </div>
        {brief && (
          <Button variant="secondary" onClick={generateBrief} loading={isLoading} className="text-sm">
            Regenerate
          </Button>
        )}
      </div>

      {isLoading && !brief ? (
        <div className="step-card space-y-4">
          <div className="flex items-center gap-2 text-brand-400 text-sm mb-4">
            <Sparkles className="w-4 h-4 animate-pulse" /> Generating your creative brief...
          </div>
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} lines={2} />)}
        </div>
      ) : brief ? (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <BriefCard title="Brand Positioning" content={brief.brandPositioning} />
            <BriefCard title="Audience Persona" content={brief.audiencePersona} />
            <BriefCard title="Campaign Theme" content={brief.campaignTheme} />
            <BriefCard title="Visual Direction" content={brief.visualDirection} />
          </div>

          <div className="step-card">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Color Palette</h3>
            <div className="flex gap-2 flex-wrap">
              {brief.colorPalette.map((color) => (
                <div key={color} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg border border-white/10" style={{ backgroundColor: color }} />
                  <span className="text-xs text-gray-400 font-mono">{color}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="step-card">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Taglines & Hooks</h3>
            <div className="space-y-2">
              {brief.taglines.map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-brand-400 font-bold shrink-0">T{i + 1}</span>
                  <span className="text-gray-200">{t}</span>
                </div>
              ))}
              {brief.hooks.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-accent-400 font-bold shrink-0">H{i + 1}</span>
                  <span className="text-gray-200">{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="step-card border-green-500/10">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-semibold text-green-400">Eco-Copy Tips</h3>
            </div>
            <ul className="space-y-1.5">
              {ECO_COPY_TIPS.map((tip, i) => (
                <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5 shrink-0">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep("formats")}>Back</Button>
        <Button onClick={() => setStep("generate")} disabled={!brief} className="flex-1 justify-center">
          Continue to Generate
        </Button>
      </div>
    </div>
  );
}

function BriefCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="step-card">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-sm text-gray-200 leading-relaxed">{content}</p>
    </div>
  );
}
