import { NextRequest, NextResponse } from "next/server";
import { minimaxText } from "@/lib/minimax";
import { parseLLMJson } from "@/lib/parse-llm-json";

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();
    if (!idea?.trim()) return NextResponse.json({ error: "Idea is required" }, { status: 400 });

    const prompt = `Analyze this marketing campaign idea. Return ONLY valid JSON, no explanation, no markdown:
{
  "brandName": "extract brand name from the idea, or use 'Brand' if not mentioned",
  "businessCategory": "string",
  "productType": "string",
  "campaignObjective": "string",
  "targetAudience": "string",
  "brandTone": "string",
  "messagingPillars": ["string", "string", "string"]
}

Campaign idea: "${idea}"`;

    const raw = await minimaxText(prompt);
    const analysis = parseLLMJson(raw);
    return NextResponse.json({ analysis });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Analysis failed" }, { status: 500 });
  }
}
