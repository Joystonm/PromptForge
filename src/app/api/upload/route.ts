import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { minimaxVision } from "@/lib/minimax";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const assetType = formData.get("type") as string ?? "brand";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;

    const uploaded = await uploadToCloudinary(base64, {
      folder: "promptforge/uploads",
      tags: ["user-upload", assetType],
    });

    const analysis = await minimaxVision(
      "Analyze this brand/product image. Describe: visual style, color palette, mood, composition, and how it could be used in a marketing campaign. Be concise (3-4 sentences).",
      uploaded.url
    );

    return NextResponse.json({ publicId: uploaded.publicId, url: uploaded.url, analysis });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
