import { NextRequest, NextResponse } from "next/server";
import { minimaxGenerateImage } from "@/lib/minimax";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { CreativeBrief, CampaignAnalysis } from "@/types/campaign";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1280&q=80";

export async function POST(req: NextRequest) {
  try {
    const { brief, analysis }: { brief: CreativeBrief; analysis: CampaignAnalysis } = await req.json();

    const brandName = analysis.brandName || "Brand";
    const imagePrompt = `Luxury premium marketing visual for "${brandName}" skincare brand. The word "${brandName}" is displayed prominently, clearly legible, elegant serif typography, centered as the focal brand element. ${brief.visualDirection}. ${brief.campaignTheme}. High-end product photography style, ${analysis.productType}, aspirational lifestyle aesthetic. The brand name "${brandName}" must be fully visible and legible in the composition.`;

    let sourceUrl: string;
    try {
      sourceUrl = await minimaxGenerateImage(imagePrompt);
    } catch {
      sourceUrl = FALLBACK_IMAGE;
    }

    const uploaded = await uploadToCloudinary(sourceUrl, {
      folder: "promptforge/generated",
      tags: ["campaign-visual"],
    });

    return NextResponse.json({ publicId: uploaded.publicId, url: uploaded.url });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Image generation failed" }, { status: 500 });
  }
}
