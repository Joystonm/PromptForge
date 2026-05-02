/**
 * Shared JSON parser for LLM responses.
 * Handles: markdown fences, trailing commas, smart quotes, truncation, unescaped quotes in values.
 */
export function parseLLMJson(raw: string): unknown {
  // Strip markdown fences
  let s = raw.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

  // Find first { or [
  const start = s.search(/[{[]/);
  if (start > 0) s = s.slice(start);

  // Find last matching closing bracket
  const lastBrace = s.lastIndexOf("}");
  const lastBracket = s.lastIndexOf("]");
  const end = Math.max(lastBrace, lastBracket);
  if (end !== -1) s = s.slice(0, end + 1);

  // Replace smart/curly quotes with straight quotes
  s = s.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");

  // Remove trailing commas before } or ]
  s = s.replace(/,\s*([}\]])/g, "$1");

  // Fix unescaped double quotes inside JSON string values
  s = s.replace(/:(\s*)"([\s\S]*?)"/g, (_, space, val) => {
    const escaped = val.replace(/(?<!\\)"/g, '\\"');
    return `:${space}"${escaped}"`;
  });

  // Try parsing as-is first
  try { return JSON.parse(s); } catch { /* continue to repair */ }

  // Attempt to repair truncated JSON by closing open structures
  s = repairTruncated(s);
  try { return JSON.parse(s); } catch { /* continue */ }

  // Last resort: extract largest object
  const match = s.match(/\{[\s\S]*\}/);
  if (match) {
    const cleaned = repairTruncated(match[0].replace(/,\s*([}\]])/g, "$1"));
    try { return JSON.parse(cleaned); } catch { /* fall through */ }
  }
  throw new Error(`JSON parse failed. Raw: ${s.slice(0, 200)}`);
}

function repairTruncated(s: string): string {
  // Remove trailing incomplete key-value (e.g. ,"key":"truncated)
  s = s.replace(/,\s*"[^"]*"\s*:\s*"[^"]*$/, "");
  s = s.replace(/,\s*"[^"]*"\s*:\s*$/, "");
  // Remove trailing comma
  s = s.replace(/,\s*$/, "");
  // Count unclosed brackets and braces
  let braces = 0, brackets = 0;
  let inString = false, escape = false;
  for (const ch of s) {
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") braces++;
    else if (ch === "}") braces--;
    else if (ch === "[") brackets++;
    else if (ch === "]") brackets--;
  }
  s += "]".repeat(Math.max(0, brackets));
  s += "}".repeat(Math.max(0, braces));
  return s;
}

