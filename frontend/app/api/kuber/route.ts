import { NextRequest, NextResponse } from "next/server";

/* ═══════════════════════════════════════════════════════════
   Kuber AI Guide — POST /api/kuber
   ═══════════════════════════════════════════════════════════
   Uses the Gemini REST API directly (no SDK dependency).
   Reads GEMINI_API_KEY from server-side env vars.

   Resilience features:
   • Model fallback chain (2.0-flash → 2.0-flash-lite → 1.5-flash)
   • Automatic retry with exponential backoff on 429 errors
   • Friendly user-facing message when all models exhausted
   ═══════════════════════════════════════════════════════════ */

const SYSTEM_PROMPT = `You are Kuber, the divine AI guide of the Arthashastra financial platform. You are an expert on global finance, stock markets, and investment strategies.

Your mission is to help users with:
1. **War Room**: AI-powered stock predictions and analysis.
2. **Market Intel**: News sentiment analysis using FinBERT.
3. **Academy**: Learn-to-Earn modules on finance and Web3.
4. **Treasury**: Managing their Web3 investment portfolio.

**Guidelines:**
- **Answer financial questions**: You CAN discuss stocks (like NVIDIA, Tata Motors), crypto, and economic concepts.
- **No Real-time Data**: If asked for *current* prices, remind them you are an AI guide, not a live ticker, and suggest checking the **War Room** or **Dashboard** for live data.
- **Refuse Non-Finance**: STRICTLY REFUSE to answer questions unrelated to finance, wealth, or the platform (e.g., "Who is the PM of India?", "Write a poem", "Fix my code").
- **Fallback Response**: If a question is off-topic, reply: "I am Kuber, guardian of Arthashastra. I only discuss the strategic wealth of this platform. How may I guide your investments today?"

Keep answers short, punchy, and helpful. Always try to steer the user back to using Arthashastra's features.`;

/** Models tried in order — each has its own free-tier quota bucket */
const MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-flash-latest",
];

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 1500;

/** Sleep helper */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Attempt a single model call, returns { ok, text?, status? } */
async function callGemini(
  model: string,
  apiKey: string,
  prompt: string
): Promise<{ ok: boolean; text?: string; retryable?: boolean }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I am Kuber, guardian of Arthashastra. How may I guide your investments today?";
    return { ok: true, text };
  }

  const isQuotaError = res.status === 429;
  if (isQuotaError) {
    console.warn(`[Kuber] 429 quota hit on model "${model}"`);
  } else {
    const err = await res.text();
    console.error(`[Kuber] ${res.status} error on model "${model}":`, err);
  }
  return { ok: false, retryable: isQuotaError };
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "A prompt string is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    /* ── Try each model in the fallback chain ──────────── */
    for (const model of MODEL_CHAIN) {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const result = await callGemini(model, apiKey, prompt);

        if (result.ok) {
          return NextResponse.json({ response: result.text });
        }

        /* Non-retryable error (e.g. 400, 500) → skip this model */
        if (!result.retryable) break;

        /* 429 → retry with exponential backoff, then fall through to next model */
        if (attempt < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt);
          console.log(`[Kuber] Retrying "${model}" in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})…`);
          await sleep(delay);
        }
      }

      console.warn(`[Kuber] Model "${model}" exhausted — trying next fallback…`);
    }

    /* ── All models exhausted ─────────────────────────── */
    console.error("[Kuber] All Gemini models exhausted.");
    return NextResponse.json({
      response:
        "🙏 Kuber is currently in deep meditation — all AI quota has been reached for now. " +
        "Please try again in a few minutes, or check back after the quota resets. " +
        "Your question has been heard, strategist!",
    });
  } catch (err) {
    console.error("[Kuber] Unexpected error:", err);
    return NextResponse.json(
      { response: "Kuber encountered an error. Please try again." },
      { status: 200 }
    );
  }
}
