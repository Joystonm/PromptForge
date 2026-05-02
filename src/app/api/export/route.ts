import { NextRequest, NextResponse } from "next/server";
import type { GeneratedAsset } from "@/types/campaign";

function buildUrl(publicId: string, w: number, h: number, text?: string) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";
  const transforms = [`w_${w}`, `h_${h}`, "c_fill", "g_auto", "f_auto", "q_auto"];
  if (text) {
    const safe = encodeURIComponent(text.slice(0, 60));
    transforms.push(`l_text:Inter_${Math.max(24, Math.floor(w / 20))}_bold:${safe},co_white,g_south,y_40`);
  }
  return `https://res.cloudinary.com/${cloud}/image/upload/${transforms.join(",")}/${publicId}`;
}

export async function POST(req: NextRequest) {
  try {
    const { assets }: { assets: GeneratedAsset[] } = await req.json();
    const exports = assets.map((a) => ({
      id: a.id,
      label: a.format.label,
      url: buildUrl(a.cloudinaryPublicId, a.format.width, a.format.height, a.copy.headline),
      width: a.format.width,
      height: a.format.height,
    }));
    return NextResponse.json({ exports });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Export failed" }, { status: 500 });
  }
}
