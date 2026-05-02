import axios from "axios";

const MINIMAX_CHAT_URL = "https://api.minimax.io/v1/text/chatcompletion_v2";
const MINIMAX_IMAGE_URL = "https://api.minimax.io/v1/image_generation";
const API_KEY = process.env.MINIMAX_API_KEY!;

const chatHeaders = {
  Authorization: `Bearer ${API_KEY}`,
  "content-type": "application/json",
};

export async function minimaxText(prompt: string, systemPrompt?: string): Promise<string> {
  const messages = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  try {
    const res = await axios.post(
      MINIMAX_CHAT_URL,
      { model: "MiniMax-M2.7", messages, max_tokens: 4096 },
      { headers: chatHeaders }
    );

    const content = res.data?.choices?.[0]?.message?.content;
    if (typeof content === "string") return content;
    throw new Error(`Unexpected response: ${JSON.stringify(res.data).slice(0, 300)}`);
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      const detail = JSON.stringify(e.response?.data).slice(0, 400);
      throw new Error(`MiniMax API error ${e.response?.status}: ${detail}`);
    }
    throw e;
  }
}

export async function minimaxVision(prompt: string, imageUrl: string): Promise<string> {
  const res = await axios.post(
    MINIMAX_CHAT_URL,
    {
      model: "MiniMax-M2.7",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageUrl } },
            { type: "text", text: prompt },
          ],
        },
      ],
    },
    { headers: chatHeaders }
  );

  const content = res.data?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  throw new Error(`Unexpected vision response: ${JSON.stringify(res.data).slice(0, 300)}`);
}

export async function minimaxGenerateImage(prompt: string): Promise<string> {
  const res = await axios.post(
    MINIMAX_IMAGE_URL,
    { model: "image-01", prompt, n: 1, response_format: "url" },
    { headers: chatHeaders }
  );
  const d = res.data as Record<string, unknown>;

  // Check for explicit failure
  const meta = d?.metadata as Record<string, unknown> | undefined;
  if (meta && String(meta.success_count) === "0") {
    throw new Error(`Image generation failed: ${JSON.stringify(meta)}`);
  }

  const inner = d?.data as Record<string, unknown> | undefined;
  if (Array.isArray(inner?.image_urls) && (inner.image_urls as string[]).length > 0)
    return (inner.image_urls as string[])[0];
  if (Array.isArray(d?.data)) {
    const item = (d.data as Record<string, unknown>[])[0];
    if (typeof item?.url === "string") return item.url;
  }
  if (typeof d?.url === "string") return d.url;
  throw new Error(`Unexpected image response: ${JSON.stringify(d).slice(0, 300)}`);
}
