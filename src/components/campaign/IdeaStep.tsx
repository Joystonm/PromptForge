"use client";
import { useState } from "react";
import { useCampaignStore } from "@/store/campaign";
import { Button } from "@/components/ui/Button";
import { Sparkles, Lightbulb } from "lucide-react";

const EXAMPLES = [
  "Create a premium skincare launch campaign",
  "Generate a festive Diwali campaign for my candle brand",
  "Design a bold product launch campaign for my SaaS platform",
  "Build a summer sale campaign for my fashion brand",
];

export function IdeaStep() {
  const { idea, setIdea, setStep, setAnalysis, setLoading, setError, isLoading } = useCampaignStore();
  const [localIdea, setLocalIdea] = useState(idea);

  async function handleAnalyze() {
    if (!localIdea.trim()) return;
    setLoading(true);
    setError(null);
    setIdea(localIdea);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idea: localIdea }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnalysis(data.analysis);
      setStep("platforms");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-slide-up">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">What's your campaign idea?</h2>
        <p className="text-gray-400">Describe it in plain English — no specs needed.</p>
      </div>

      <div className="step-card space-y-4">
        <textarea
          value={localIdea}
          onChange={(e) => setLocalIdea(e.target.value)}
          placeholder="e.g. Create a premium skincare launch campaign for a new anti-aging serum targeting women 30-50..."
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-brand-500 transition-colors"
        />
        <Button onClick={handleAnalyze} loading={isLoading} disabled={!localIdea.trim()} className="w-full justify-center">
          <Sparkles className="w-4 h-4" /> Analyze Campaign Idea
        </Button>
      </div>

      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Lightbulb className="w-4 h-4" /> Try an example
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setLocalIdea(ex)}
              className="text-left text-sm glass rounded-xl px-4 py-3 text-gray-300 hover:border-brand-500/40 hover:text-white transition-all"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
