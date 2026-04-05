import { getAnthropicClient } from "@/lib/anthropic";
import {
  SYSTEM_PROMPT,
  buildOverlapPrompt,
  buildSharpenPrompt,
  buildPulsePrompt,
} from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { type, competitor, audience, affirmData, competitorData, allCompetitors } =
      await request.json();

    if (!type || !["overlap", "sharpen", "pulse"].includes(type)) {
      return new Response(
        JSON.stringify({ error: "Invalid analysis type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "ANTHROPIC_API_KEY not configured. Set it in your Vercel environment variables.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    let userPrompt = "";

    if (type === "overlap") {
      userPrompt = buildOverlapPrompt(competitor, affirmData, competitorData);
    } else if (type === "sharpen") {
      userPrompt = buildSharpenPrompt(competitor, audience, affirmData, competitorData);
    } else if (type === "pulse") {
      userPrompt = buildPulsePrompt(allCompetitors);
    }

    const client = getAnthropicClient();

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
                )
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream error occurred" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("API error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
