"use client";
import { buildCloudinaryUrl } from "@/lib/cloudinary-url";
import type { GeneratedAsset } from "@/types/campaign";

const BREAKPOINTS = [
  { label: "Mobile", width: 390, icon: "📱" },
  { label: "Tablet", width: 768, icon: "📟" },
  { label: "Desktop", width: 1280, icon: "🖥️" },
];

export function ResponsivePreview({ asset }: { asset: GeneratedAsset }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        One source image — automatically resized, cropped, and optimized for every device via Cloudinary URL transforms.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {BREAKPOINTS.map(({ label, width, icon }) => {
          // Scale height proportionally to asset format
          const h = Math.round((width / asset.format.width) * asset.format.height);
          const clampedH = Math.min(h, 260);
          const clampedW = Math.round((clampedH / h) * width);
          const url = buildCloudinaryUrl(asset.cloudinaryPublicId, width, h, { format: "auto", quality: "auto" });
          const sizeKb = Math.round((width * h * 0.18) / 1024 * 10) / 10;
          return (
            <div key={label} className="step-card flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 w-full">
                <span className="text-lg">{icon}</span>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-[10px] text-gray-500">{width}px wide · ~{sizeKb} KB</p>
                </div>
              </div>
              <div className="w-full bg-black/30 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: clampedH }}>
                <img
                  src={url}
                  alt={`${label} preview`}
                  width={clampedW}
                  height={clampedH}
                  className="object-cover rounded"
                  loading="lazy"
                />
              </div>
              <p className="text-[10px] text-gray-500 font-mono break-all text-center">
                w_{width},h_{h},f_auto,q_auto
              </p>
            </div>
          );
        })}
      </div>
      <div className="step-card text-xs text-gray-500 space-y-1">
        <p className="text-green-400 font-medium text-sm mb-2">🌱 Responsive = Sustainable</p>
        <p>Serving correctly-sized images to each device avoids transferring unnecessary pixels — reducing bandwidth, energy, and load time.</p>
      </div>
    </div>
  );
}
