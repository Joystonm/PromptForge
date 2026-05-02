"use client";
import { useState, useEffect } from "react";
import {
  buildOverlayUrl, buildGenFillUrl, buildArtisticUrl,
  buildCloudinaryUrl, buildEnhanceUrl, buildGravityUrl, buildBgRemovalUrl,
} from "@/lib/cloudinary-url";
import type { GeneratedAsset } from "@/types/campaign";
import { Wand2, Type, Expand, Palette, Download, Sparkles, Crop, Copy, Check, Loader2 } from "lucide-react";

type StudioMode = "overlay" | "genfill" | "artistic" | "enhance" | "gravity" | "bgremoval";

const ART_STYLES = [
  "athena", "audrey", "daguerre", "eucalyptus", "fes",
  "frost", "hairspray", "hokusai", "peacock", "primavera",
  "quartz", "red_rock", "sizzle", "sonnet", "zorro",
] as const;

const GEN_FILL_RATIOS = [
  { label: "Square 1:1", w: 1080, h: 1080 },
  { label: "Portrait 4:5", w: 1080, h: 1350 },
  { label: "Landscape 16:9", w: 1280, h: 720 },
  { label: "Banner 3:1", w: 1200, h: 400 },
  { label: "Story 9:16", w: 1080, h: 1920 },
  { label: "Twitter Card", w: 1200, h: 628 },
];

const ENHANCE_MODES = [
  { id: "improve" as const, label: "Auto Improve", desc: "e_improve" },
  { id: "sharpen" as const, label: "Sharpen", desc: "e_sharpen:100" },
  { id: "auto_color" as const, label: "Color Correct", desc: "e_auto_color" },
  { id: "vibrance" as const, label: "Vibrance", desc: "e_vibrance" },
  { id: "auto_brightness" as const, label: "Auto Brightness", desc: "e_auto_brightness" },
  { id: "auto_contrast" as const, label: "Auto Contrast", desc: "e_auto_contrast" },
  { id: "unsharp_mask" as const, label: "Unsharp Mask", desc: "e_unsharp_mask" },
  { id: "saturation" as const, label: "Saturation Boost", desc: "e_saturation:50" },
  { id: "gamma" as const, label: "Gamma Correct", desc: "e_gamma:50" },
  { id: "upscale" as const, label: "AI Upscale", desc: "e_upscale" },
  { id: "noise" as const, label: "Noise Reduce", desc: "e_noise:10" },
];

const GRAVITY_OPTIONS = [
  { id: "auto" as const, label: "Auto (AI)", desc: "g_auto" },
  { id: "face" as const, label: "Face", desc: "c_thumb,g_face" },
  { id: "faces" as const, label: "Faces", desc: "c_thumb,g_faces" },
  { id: "center" as const, label: "Center", desc: "g_center" },
  { id: "north" as const, label: "Top", desc: "g_north" },
  { id: "south" as const, label: "Bottom", desc: "g_south" },
  { id: "north_east" as const, label: "Top Right", desc: "g_north_east" },
  { id: "north_west" as const, label: "Top Left", desc: "g_north_west" },
  { id: "south_east" as const, label: "Bottom Right", desc: "g_south_east" },
  { id: "south_west" as const, label: "Bottom Left", desc: "g_south_west" },
  { id: "east" as const, label: "Right", desc: "g_east" },
  { id: "west" as const, label: "Left", desc: "g_west" },
];

function download(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url; a.download = name; a.target = "_blank"; a.rel = "noopener noreferrer";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

export function CloudinaryStudio({ asset }: { asset: GeneratedAsset }) {
  const [mode, setMode] = useState<StudioMode>("overlay");
  const [artStyle, setArtStyle] = useState<typeof ART_STYLES[number]>("peacock");
  const [fillRatio, setFillRatio] = useState(GEN_FILL_RATIOS[0]);
  const [enhanceMode, setEnhanceMode] = useState<typeof ENHANCE_MODES[number]["id"]>("improve");
  const [gravity, setGravity] = useState<typeof GRAVITY_OPTIONS[number]["id"]>("auto");
  const [headline, setHeadline] = useState(asset.copy.headline);
  const [cta, setCta] = useState(asset.copy.cta);
  const [copied, setCopied] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [bgColor, setBgColor] = useState("");

  const { cloudinaryPublicId: pid, format: fmt } = asset;

  const previewUrl =
    mode === "overlay" ? buildOverlayUrl(pid, fmt.width, fmt.height, headline, cta)
    : mode === "genfill" ? buildGenFillUrl(pid, fillRatio.w, fillRatio.h)
    : mode === "artistic" ? buildArtisticUrl(pid, fmt.width, fmt.height, artStyle)
    : mode === "enhance" ? buildEnhanceUrl(pid, fmt.width, fmt.height, enhanceMode)
    : mode === "bgremoval" ? buildBgRemovalUrl(pid, fmt.width, fmt.height, bgColor || undefined)
    : buildGravityUrl(pid, fmt.width, fmt.height, gravity);

  const originalUrl = buildCloudinaryUrl(pid, fmt.width, fmt.height);

  // Show loader whenever the transform URL changes
  useEffect(() => { setImgLoading(true); }, [previewUrl]);

  function copyUrl() {
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const modes = [
    { id: "overlay" as StudioMode, label: "Text Overlay", icon: Type, desc: "Burn headline & CTA into image" },
    { id: "genfill" as StudioMode, label: "Generative Fill", icon: Expand, desc: "AI extends canvas to any ratio" },
    { id: "artistic" as StudioMode, label: "Art Filters", icon: Palette, desc: "15 one-click style variants" },
    { id: "enhance" as StudioMode, label: "AI Enhance", icon: Sparkles, desc: "Auto improve, sharpen, correct" },
    { id: "gravity" as StudioMode, label: "Smart Crop", icon: Crop, desc: "AI focal point reframing" },
    { id: "bgremoval" as StudioMode, label: "BG Removal", icon: Wand2, desc: "AI removes background instantly" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Wand2 className="w-4 h-4 text-brand-400" />
        <p className="text-sm font-semibold">Cloudinary Studio</p>
        <span className="text-[10px] bg-brand-600/20 text-brand-300 rounded-full px-2 py-0.5">Live URL Transforms</span>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {modes.map(({ id, label, icon: Icon, desc }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`step-card text-left transition-all p-3 ${mode === id ? "border-brand-500/60 bg-brand-600/10" : "hover:border-white/20"}`}
          >
            <Icon className={`w-4 h-4 mb-1.5 ${mode === id ? "text-brand-400" : "text-gray-500"}`} />
            <p className="text-xs font-semibold">{label}</p>
            <p className="text-[10px] text-gray-500 mt-0.5 hidden sm:block">{desc}</p>
          </button>
        ))}
      </div>

      {/* Controls */}
      {mode === "overlay" && (
        <div className="step-card space-y-3">
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider">Headline</label>
            <input value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={50}
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500/50" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider">CTA</label>
            <input value={cta} onChange={(e) => setCta(e.target.value)} maxLength={30}
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500/50" />
          </div>
          <p className="text-[10px] text-gray-500">Text composited server-side by Cloudinary — gradient banner + bold headline + CTA, all via URL.</p>
        </div>
      )}

      {mode === "genfill" && (
        <div className="step-card space-y-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Target Aspect Ratio</p>
          <div className="grid grid-cols-3 gap-2">
            {GEN_FILL_RATIOS.map((r) => (
              <button key={r.label} onClick={() => setFillRatio(r)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${fillRatio.label === r.label ? "bg-brand-600 text-white" : "glass text-gray-400 hover:text-white"}`}>
                {r.label}
                <span className="block text-[10px] opacity-60">{r.w}×{r.h}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-1">AI generates background pixels to fill the extended canvas — no cropping, no distortion.</p>
        </div>
      )}

      {mode === "artistic" && (
        <div className="step-card space-y-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Style Filter (e_art:)</p>
          <div className="flex flex-wrap gap-1.5">
            {ART_STYLES.map((s) => (
              <button key={s} onClick={() => setArtStyle(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all capitalize ${artStyle === s ? "bg-brand-600 text-white" : "glass text-gray-400 hover:text-white"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "enhance" && (
        <div className="step-card space-y-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Enhancement Type</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ENHANCE_MODES.map((e) => (
              <button key={e.id} onClick={() => setEnhanceMode(e.id)}
                className={`px-3 py-2 rounded-lg text-left transition-all ${enhanceMode === e.id ? "bg-brand-600 text-white" : "glass text-gray-400 hover:text-white"}`}>
                <p className="text-xs font-medium">{e.label}</p>
                <p className="text-[10px] opacity-60 font-mono">{e.desc}</p>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-1">Cloudinary AI analyzes and enhances the image automatically — no manual adjustments needed.</p>
        </div>
      )}

      {mode === "gravity" && (
        <div className="step-card space-y-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Focal Point / Gravity</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {GRAVITY_OPTIONS.map((g) => (
              <button key={g.id} onClick={() => setGravity(g.id)}
                className={`px-3 py-2 rounded-lg text-left transition-all ${gravity === g.id ? "bg-brand-600 text-white" : "glass text-gray-400 hover:text-white"}`}>
                <p className="text-xs font-medium">{g.label}</p>
                <p className="text-[10px] opacity-60 font-mono">{g.desc}</p>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-1">Cloudinary detects faces, subjects, or uses AI to keep the most important content in frame when cropping.</p>
        </div>
      )}

      {mode === "bgremoval" && (
        <div className="step-card space-y-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Background Replacement</p>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider">Replace with color (hex, optional)</label>
            <div className="flex gap-2 mt-1">
              <input
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6))}
                placeholder="e.g. ffffff (leave blank for transparent)"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500/50 font-mono"
              />
              {bgColor.length === 6 && (
                <div className="w-10 h-10 rounded-lg border border-white/10 shrink-0" style={{ background: `#${bgColor}` }} />
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["ffffff", "000000", "f3f4f6", "1e1b4b", "052e16"].map((c) => (
              <button key={c} onClick={() => setBgColor(c)}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${bgColor === c ? "border-brand-400" : "border-white/10"}`}
                style={{ background: `#${c}` }} title={`#${c}`} />
            ))}
            <button onClick={() => setBgColor("")}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${bgColor === "" ? "bg-brand-600 text-white" : "glass text-gray-400 hover:text-white"}`}>
              Transparent
            </button>
          </div>
          <p className="text-[10px] text-gray-500">
            <code className="text-brand-300">e_background_removal</code> — Cloudinary AI isolates the subject in one URL parameter. Transparent output uses PNG; color fill uses WebP/AVIF.
          </p>
        </div>
      )}

      {/* Before / After preview */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Original</p>
          <div className="bg-black/30 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
            <img src={originalUrl} alt="Original" className="max-w-full max-h-full object-contain" loading="lazy" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-brand-400 uppercase tracking-wider">Cloudinary Transform ✦</p>
            <button onClick={() => download(previewUrl, `studio-${mode}.jpg`)}
              className="flex items-center gap-1 text-[10px] text-brand-400 hover:text-brand-300 transition-colors">
              <Download className="w-3 h-3" /> Download
            </button>
          </div>
          <div className="bg-black/30 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative">
            {imgLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl z-10">
                <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
              </div>
            )}
            <img
              key={previewUrl}
              src={previewUrl}
              alt="Transformed"
              className="max-w-full max-h-full object-contain"
              loading="lazy"
              onLoad={() => setImgLoading(false)}
              onError={() => setImgLoading(false)}
            />
          </div>
        </div>
      </div>

      {/* URL inspector with copy */}
      <div className="step-card">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Live Transform URL</p>
          <button onClick={copyUrl}
            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors">
            {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy URL</>}
          </button>
        </div>
        <p className="text-[10px] font-mono text-brand-300 break-all leading-relaxed">{previewUrl}</p>
      </div>
    </div>
  );
}
