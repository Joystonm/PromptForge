import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export async function uploadToCloudinary(
  source: string, // URL or base64
  options: { folder?: string; public_id?: string; tags?: string[] } = {}
) {
  const result = await cloudinary.uploader.upload(source, {
    folder: options.folder ?? "promptforge",
    public_id: options.public_id,
    tags: options.tags ?? ["promptforge"],
    resource_type: "image",
    // Pre-generate common variants eagerly so first request is instant
    eager: [
      { width: 1080, height: 1080, crop: "fill", gravity: "auto", fetch_format: "auto", quality: "auto", dpr: "auto" },
      { width: 1200, height: 628, crop: "fill", gravity: "auto", fetch_format: "auto", quality: "auto", dpr: "auto", flags: "progressive" },
      { width: 1280, height: 720, crop: "fill", gravity: "auto", fetch_format: "auto", quality: "auto", dpr: "auto" },
    ],
    eager_async: true,
  });
  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    format: result.format,
  };
}

export function buildTransformUrl(
  publicId: string,
  width: number,
  height: number,
  overlays?: { text?: string; publicId?: string }
) {
  const base = cloudinary.url(publicId, {
    width,
    height,
    crop: "fill",
    gravity: "auto",
    fetch_format: "auto",
    quality: "auto",
    dpr: "auto",
    ...(overlays?.text && {
      overlay: {
        font_family: "Inter",
        font_size: Math.max(24, Math.floor(width / 20)),
        font_weight: "bold",
        text: overlays.text.slice(0, 60),
      },
      color: "white",
      gravity: "south",
      y: 40,
    }),
  });
  return base;
}

/** Fetch real asset metadata from Cloudinary Admin API (server-side only). */
export async function getAssetInfo(publicId: string): Promise<{ bytes: number; format: string; width: number; height: number } | null> {
  try {
    const result = await cloudinary.api.resource(publicId, { resource_type: "image" });
    return { bytes: result.bytes, format: result.format, width: result.width, height: result.height };
  } catch {
    return null;
  }
}
