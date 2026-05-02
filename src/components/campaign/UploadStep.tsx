"use client";
import { useRef, useState } from "react";
import { useCampaignStore } from "@/store/campaign";
import { Button } from "@/components/ui/Button";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import type { UploadedAsset } from "@/types/campaign";

const ASSET_TYPES = ["logo", "product", "brand", "reference"] as const;

export function UploadStep() {
  const { uploadedAssets, addUploadedAsset, setStep } = useCampaignStore();
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<typeof ASSET_TYPES[number]>("product");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("type", selectedType);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        addUploadedAsset({ publicId: data.publicId, url: data.url, type: selectedType, analysis: data.analysis });
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold mb-1">Upload Brand Assets</h2>
        <p className="text-gray-400 text-sm">Add logos, product images, and reference visuals. AI will analyze them.</p>
      </div>

      <div className="step-card space-y-4">
        <div className="flex gap-2 flex-wrap">
          {ASSET_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedType === t ? "bg-brand-600 text-white" : "glass text-gray-400 hover:text-white"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-brand-500/40 transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-brand-400 mx-auto mb-2" />
          ) : (
            <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          )}
          <p className="text-sm text-gray-400">
            {uploading ? "Uploading & analyzing..." : "Click to upload or drag & drop"}
          </p>
          <p className="text-xs text-gray-600 mt-1">PNG, JPG, WebP up to 10MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {uploadedAssets.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {uploadedAssets.map((asset) => (
            <div key={asset.publicId} className="step-card flex gap-3">
              <img src={asset.url} alt={asset.type} className="w-16 h-16 rounded-lg object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-brand-400 uppercase mb-1">{asset.type}</p>
                {asset.analysis && (
                  <p className="text-xs text-gray-400 line-clamp-3">{asset.analysis}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep("brief")}>Back</Button>
        <Button onClick={() => setStep("generate")} className="flex-1 justify-center">
          {uploadedAssets.length > 0 ? `Generate Campaign (${uploadedAssets.length} assets)` : "Skip & Generate"}
        </Button>
      </div>
    </div>
  );
}
