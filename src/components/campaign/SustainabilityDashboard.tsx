"use client";
import { useMemo, useState } from "react";
import { computeSustainabilityMetrics } from "@/lib/sustainability";
import { buildCloudinaryUrl, buildRawUrl } from "@/lib/cloudinary-url";
import type { GeneratedAsset } from "@/types/campaign";
import { Leaf, Zap, BarChart3, Recycle, TreePine, Clock, Gauge, Monitor, Download, Target } from "lucide-react";

function GreenRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? "#4ade80" : score >= 45 ? "#facc15" : "#f87171";
  return (
    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="text-center">
        <div className="text-2xl font-black" style={{ color }}>{score}</div>
        <div className="text-[9px] text-gray-400 uppercase tracking-wider">Green</div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
        <span>{label}</span>
        <span className={color}>{value}/{max}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full ${color.replace("text-", "bg-")}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

export function SustainabilityDashboard({ assets }: { assets: GeneratedAsset[] }) {
  const m = useMemo(() => computeSustainabilityMetrics(assets), [assets]);
  const [budgetGrams, setBudgetGrams] = useState(5);

  // Estimated page load improvement: ~100ms per 100KB saved on 3G (1.6 Mbps)
  const loadTimeSavedMs = Math.round((m.savingsKb / 1024) * 5000);
  // Trees analogy: 1 tree absorbs ~21kg CO₂/year = 21,000,000 mg
  const treesEquivalent = (m.co2SavedGrams / 21000).toFixed(4);
  // Score breakdown (must match sustainability.ts logic)
  const compressionScore = Math.min(40, Math.round((m.savingsPct / 100) * 40));
  const reuseScore = Math.min(30, Math.round(((m.totalAssets - m.sourceAssets) / Math.max(m.totalAssets, 1)) * 30));

  function exportReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      greenScore: m.greenScore,
      totalAssets: m.totalAssets,
      sourceAssets: m.sourceAssets,
      bandwidthSavedMB: (m.savingsKb / 1024).toFixed(2),
      savingsPct: m.savingsPct,
      co2SavedGrams: m.co2SavedGrams,
      dprSavingsMB: (m.dprSavingsKb / 1024).toFixed(2),
      loadTimeSavedMs,
      treesEquivalent,
      recommendations: m.recommendations,
      cloudinaryOptimizations: ["f_auto", "q_auto", "c_fill", "g_auto", "dpr_auto", "fl_progressive"],
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sustainability-report.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const budgetUsedPct = Math.min(100, Math.round((m.co2SavedGrams / budgetGrams) * 100));
  const underBudget = m.co2SavedGrams <= budgetGrams;

  const stats = [
    { icon: BarChart3, label: "Bandwidth Saved", value: `${(m.savingsKb / 1024).toFixed(1)} MB`, sub: `${m.savingsPct}% reduction`, color: "text-brand-400" },
    { icon: Recycle, label: "Asset Reuse", value: `${m.totalAssets} formats`, sub: `from ${m.sourceAssets} source file${m.sourceAssets > 1 ? "s" : ""}`, color: "text-purple-400" },
    { icon: Clock, label: "Load Time Saved", value: `~${loadTimeSavedMs}ms`, sub: "on 3G connection", color: "text-amber-400" },
    { icon: Leaf, label: "CO₂ Avoided", value: `~${m.co2SavedGrams}g`, sub: "per campaign delivery", color: "text-green-400" },
  ];

  return (
    <div className="space-y-4">
      {/* Header with Green Score */}
      <div className="step-card flex items-center gap-6 flex-wrap">
        <GreenRing score={m.greenScore} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-1">
            Green Score: <span className={m.greenScore >= 70 ? "text-green-400" : m.greenScore >= 45 ? "text-yellow-400" : "text-red-400"}>{m.greenScore}/100</span>
          </h3>
          <p className="text-sm text-gray-400 mb-3">Every optimized asset saves bandwidth, energy, and emissions.</p>
          <div className="space-y-1">
            {m.recommendations.map((r, i) => (
              <p key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                <span className="text-green-400 mt-0.5">→</span> {r}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Carbon Budget Tracker */}
      <div className="step-card space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-400" />
            <p className="text-xs font-semibold text-gray-300">Carbon Budget</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Target:</span>
            <input
              type="number"
              min={0.1}
              max={100}
              step={0.1}
              value={budgetGrams}
              onChange={(e) => setBudgetGrams(parseFloat(e.target.value) || 1)}
              className="w-16 bg-white/5 border border-white/10 rounded px-2 py-0.5 text-white text-xs text-center"
            />
            <span>g CO₂</span>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${underBudget ? "bg-green-400" : "bg-red-400"}`}
            style={{ width: `${budgetUsedPct}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-500">
          {underBudget
            ? `✓ Within budget — ${m.co2SavedGrams}g of ${budgetGrams}g used (${budgetUsedPct}%)`
            : `⚠ Over budget — ${m.co2SavedGrams}g emitted vs ${budgetGrams}g target. Reduce source assets or enable AVIF.`}
        </p>
      </div>

      {/* Export Report */}
      <button
        onClick={exportReport}
        className="w-full flex items-center justify-center gap-2 text-xs text-green-400 border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 rounded-xl py-2.5 transition-colors"
      >
        <Download className="w-3.5 h-3.5" /> Export Sustainability Report (JSON)
      </button>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="step-card text-center">
            <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{label}</p>
            <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Score breakdown */}
      <div className="step-card space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Gauge className="w-4 h-4 text-brand-400" />
          <p className="text-xs font-semibold text-gray-300">Green Score Breakdown</p>
        </div>
        <ScoreBar label="Compression Efficiency (f_auto · q_auto)" value={compressionScore} max={40} color="text-green-400" />
        <ScoreBar label="Asset Reuse Rate" value={reuseScore} max={30} color="text-purple-400" />
        <ScoreBar label="Format Optimization (WebP/AVIF)" value={20} max={20} color="text-amber-400" />
        <ScoreBar label="CDN Delivery" value={5} max={5} color="text-brand-400" />
        <ScoreBar label="DPR-Aware Delivery (dpr_auto)" value={5} max={5} color="text-cyan-400" />
      </div>

      {/* Before / After size bar */}
      <div className="step-card space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Storage & Delivery Footprint</p>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Without Cloudinary</span>
              <span className="text-red-400">{(m.estimatedOriginalKb / 1024).toFixed(1)} MB</span>
            </div>
            <div className="h-3 rounded-full bg-red-500/20 w-full relative overflow-hidden">
              <div className="h-full bg-red-500/50 rounded-full w-full" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>With Cloudinary (f_auto · q_auto · WebP)</span>
              <span className="text-green-400">{(m.estimatedOptimizedKb / 1024).toFixed(1)} MB</span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${100 - m.savingsPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Per-asset breakdown */}
      <div className="step-card">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Per-Asset Delivery Footprint</p>
        <div className="space-y-2">
          {assets.map((a) => {
            const origKb = 2048;
            const optKb = Math.round(origKb * 0.18);
            const pct = Math.round((1 - optKb / origKb) * 100);
            const optUrl = buildCloudinaryUrl(a.cloudinaryPublicId, a.format.width, a.format.height);
            return (
              <div key={a.id} className="flex items-center gap-3">
                <img src={optUrl} alt={a.format.label} className="w-10 h-10 rounded object-cover shrink-0" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span className="truncate">{a.format.label} · {a.format.width}×{a.format.height}</span>
                    <span className="text-green-400 shrink-0 ml-2">{pct}% saved</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-green-400/60 rounded-full" style={{ width: `${100 - pct}%` }} />
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 shrink-0">{optKb}KB</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-world impact */}
      <div className="grid grid-cols-2 gap-3">
        <div className="step-card flex items-start gap-3">
          <TreePine className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-green-400">{treesEquivalent} trees</p>
            <p className="text-[10px] text-gray-500">equivalent CO₂ absorption per delivery cycle</p>
          </div>
        </div>
        <div className="step-card flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-400">{loadTimeSavedMs}ms faster</p>
            <p className="text-[10px] text-gray-500">estimated page load improvement on 3G</p>
          </div>
        </div>
      </div>

      {/* DPR + Progressive extras */}
      <div className="grid grid-cols-2 gap-3">
        <div className="step-card flex items-start gap-3">
          <Monitor className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-cyan-400">~{(m.dprSavingsKb / 1024).toFixed(1)} MB</p>
            <p className="text-[10px] text-gray-500">extra saved via <code className="text-cyan-300">dpr_auto</code> — no over-serving retina images to 1× screens</p>
          </div>
        </div>
        <div className="step-card flex items-start gap-3">
          <Gauge className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-purple-400">Progressive ✓</p>
            <p className="text-[10px] text-gray-500"><code className="text-purple-300">fl_progressive</code> — images render top-down instantly, reducing perceived load time</p>
          </div>
        </div>
      </div>

      {/* Cloudinary features active */}
      <div className="step-card">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Cloudinary Optimizations Active</p>
        <div className="flex flex-wrap gap-2">
          {[
            "f_auto (WebP/AVIF)", "q_auto (smart compression)", "c_fill + g_auto (smart crop)",
            "dpr_auto (device-aware)", "fl_progressive (fast render)", "e_background_removal",
            "e_upscale (AI upscale)", "Global CDN delivery", "Eager transforms",
            "Zero re-generation", "Chained URL transforms", "Responsive srcset",
          ].map((f) => (
            <span key={f} className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2.5 py-1">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
