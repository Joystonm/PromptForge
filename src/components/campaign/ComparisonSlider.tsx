"use client";
import { useRef, useState, useCallback } from "react";
import { buildCloudinaryUrl, buildRawUrl } from "@/lib/cloudinary-url";
import { Download } from "lucide-react";

interface Props {
  publicId: string;
  width: number;
  height: number;
  originalSizeKb?: number;
}

function downloadUrl(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function ComparisonSlider({ publicId, width, height, originalSizeKb }: Props) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const optimizedUrl = buildCloudinaryUrl(publicId, width, height, { format: "webp", quality: "auto" });
  const rawUrl = buildRawUrl(publicId);

  const estimatedOptKb = originalSizeKb ? Math.round(originalSizeKb * 0.18) : null;

  const move = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  }, []);

  return (
    <div className="step-card space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Cloudinary Optimization</p>
        {estimatedOptKb && originalSizeKb && (
          <span className="text-xs text-green-400 font-mono">
            ~{originalSizeKb}KB → ~{estimatedOptKb}KB WebP · {Math.round((1 - estimatedOptKb / originalSizeKb) * 100)}% smaller
          </span>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden cursor-col-resize select-none"
        style={{ aspectRatio: `${width}/${height}`, maxHeight: 280 }}
        onMouseDown={() => { dragging.current = true; }}
        onMouseMove={(e) => { if (dragging.current) move(e.clientX); }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onTouchMove={(e) => move(e.touches[0].clientX)}
      >
        <img src={optimizedUrl} alt="Optimized" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={rawUrl} alt="Original" className="absolute inset-0 w-full h-full object-cover"
            style={{ width: containerRef.current?.offsetWidth ?? "100%" }} />
        </div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${pos}%` }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center">
            <span className="text-gray-800 text-xs font-bold">⇔</span>
          </div>
        </div>
        <span className="absolute top-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">Original</span>
        <span className="absolute top-2 right-2 text-[10px] bg-brand-600/80 text-white px-2 py-0.5 rounded">Cloudinary WebP</span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[10px] text-gray-500">⚡ f_auto · q_auto · c_fill · g_auto — served via Cloudinary CDN</p>
        <button
          onClick={() => downloadUrl(optimizedUrl, `optimized-${width}x${height}.webp`)}
          className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Download Optimized
        </button>
      </div>
    </div>
  );
}
