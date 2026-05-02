import { NextRequest, NextResponse } from "next/server";
import { minimaxText } from "@/lib/minimax";
import { parseLLMJson } from "@/lib/parse-llm-json";
import type { CampaignAnalysis } from "@/types/campaign";

export async function POST(req: NextRequest) {
  try {
    const { analysis, idea }: { analysis: CampaignAnalysis; idea: string } = await req.json();

    const brandName = analysis.brandName || "Brand";
    const prompt = `You are a senior creative director. Create a creative brief. Be CONCISE — max 10 words per string value.

CRITICAL: Brand name is exactly "${brandName}". Every tagline MUST contain "${brandName}".

Campaign: ${idea.slice(0, 500)}
Business: ${analysis.businessCategory} - ${analysis.productType}
Tone: ${analysis.brandTone}
Audience: ${analysis.targetAudience}
Objective: ${analysis.campaignObjective}

Return ONLY this JSON, no extra text:
{"brandPositioning":"max 10 words","audiencePersona":"max 10 words","messagingFramework":"max 10 words","campaignTheme":"max 10 words","visualDirection":"max 10 words","colorPalette":["#hex","#hex","#hex","#hex","#hex"],"typographySuggestions":"max 10 words","taglines":["with ${brandName}","with ${brandName}","with ${brandName}"],"hooks":["max 10 words","max 10 words","max 10 words"]}`;

    const raw = await minimaxText(prompt);
    const brief = parseLLMJson(raw);
    return NextResponse.json({ brief });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Brief generation failed" }, { status: 500 });
  }
}
