import { NextRequest, NextResponse } from "next/server";
import { minimaxText } from "@/lib/minimax";
import { parseLLMJson } from "@/lib/parse-llm-json";
import type { CreativeBrief, CampaignAnalysis, Format } from "@/types/campaign";

export async function POST(req: NextRequest) {
  try {
    const { brief, analysis, format }: { brief: CreativeBrief; analysis: CampaignAnalysis; format: Format } = await req.json();

    const brandName = analysis.brandName || "Brand";
    const prompt = `Write marketing copy for a ${format.label} ad (${format.width}x${format.height}px).
Brand name: "${brandName}" — include this exact name in headline and caption.
Campaign theme: ${brief.campaignTheme}
Brand tone: ${analysis.brandTone}
Audience: ${analysis.targetAudience}

Return ONLY valid JSON with no markdown or explanation:
{"headline":"...","caption":"...","adDescription":"...","cta":"...","toneVariations":[{"tone":"bold","text":"..."},{"tone":"warm","text":"..."}]}`;

    const raw = await minimaxText(prompt);
    const copy = parseLLMJson(raw);
    return NextResponse.json({ copy });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Copy generation failed" }, { status: 500 });
  }
}
