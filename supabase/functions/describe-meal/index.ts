// Supabase Edge Function: describe-meal
// Generates an AI meal description (no nutrition) from an uploaded photo.
//
// Expected body:
// - imageUrl: string (public URL to the uploaded image) OR imageBase64: string
// - mealType: string
//
// Returns: { description: string, confidence: number }

import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("GOOGLE_API_KEY");

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function jsonWithHeaders(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function extractJson(text: string): { description: string; confidence: number } {
  // Try to find JSON block first
  const fenced = text.match(/```json\\s*([\\s\\S]*?)\\s*```/i);
  const raw = fenced?.[1] ?? text;
  const objMatch = raw.match(/\\{[\\s\\S]*\\}/);
  const candidate = objMatch?.[0] ?? raw;
  const parsed = JSON.parse(candidate);
  return {
    description: String(parsed.description ?? ""),
    confidence: Number(parsed.confidence ?? 0.5),
  };
}

async function getImageBase64(input: { imageUrl?: string; imageBase64?: string }): Promise<string> {
  if (input.imageBase64) return input.imageBase64;
  if (!input.imageUrl) throw new Error("Missing imageUrl or imageBase64");

  const resp = await fetch(input.imageUrl);
  if (!resp.ok) throw new Error(`Failed to fetch imageUrl (${resp.status})`);
  const buf = new Uint8Array(await resp.arrayBuffer());
  return encodeBase64(buf);
}

serve(async (req) => {
  const reqId = crypto.randomUUID();
  const started = Date.now();

  if (!GEMINI_API_KEY) {
    console.error("[describe-meal]", reqId, "Missing GEMINI_API_KEY secret");
    return json({ error: "Missing GEMINI_API_KEY secret" }, 500);
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    let parsed: any;
    try {
      parsed = await req.json();
    } catch (e) {
      console.error("[describe-meal]", reqId, "Invalid JSON body");
      return json({ error: "Invalid JSON body" }, 400);
    }

    const imageUrl = parsed?.imageUrl;
    const imageBase64 = parsed?.imageBase64;
    const mealType = parsed?.mealType;

    console.log("[describe-meal]", reqId, "request", {
      hasImageUrl: !!imageUrl,
      hasImageBase64: !!imageBase64,
      mealType: String(mealType ?? ""),
    });

    let base64: string;
    try {
      base64 = await getImageBase64({ imageUrl, imageBase64 });
    } catch (e) {
      console.error("[describe-meal]", reqId, "image fetch/encode failed", String(e?.message ?? e));
      return json({ error: "Image fetch/encode failed", details: String(e?.message ?? e) }, 500);
    }

    const prompt =
      `You are a nutrition-aware food recognition assistant specializing in South Asian cuisine (India, Pakistan, Bangladesh, Nepal).\n` +
      `Task: Write a short, vivid meal description (1-2 sentences) of what you see in the photo.\n` +
      `Focus on dish names if recognizable (e.g., biryani, dal, curry, roti, naan, momo), plus key sides (raita, chutney).\n` +
      `Include portion context (small/medium/large) if evident.\n` +
      `Meal type context: ${String(mealType ?? "unknown")}.\n\n` +
      `Return ONLY valid JSON with this exact shape:\n` +
      `{"description":"...","confidence":0.0}\n` +
      `Where confidence is 0.0-1.0.`;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 250,
      },
    };

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const geminiResp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!geminiResp.ok) {
      const t = await geminiResp.text();
      const trimmed = t.length > 1200 ? t.slice(0, 1200) + "…(truncated)" : t;
      console.error("[describe-meal]", reqId, "Gemini request failed", {
        status: geminiResp.status,
        body: trimmed,
      });
      const retryAfter = geminiResp.headers.get("retry-after") ?? undefined;
      const status = geminiResp.status;
      const payload = { error: "Gemini request failed", status, details: trimmed };

      // Preserve 429 for quota issues so the client can handle it gracefully.
      if (status === 429) {
        return jsonWithHeaders(payload, 429, retryAfter ? { "retry-after": retryAfter } : {});
      }

      return json(payload, 500);
    }

    const out = await geminiResp.json();
    const text =
      out?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text ?? "").join("") ??
      "";

    const result = extractJson(text);
    if (!result.description) {
      // Fallback to raw text if model didn't comply
      return json({ description: text.slice(0, 400).trim(), confidence: 0.3 });
    }

    console.log("[describe-meal]", reqId, "ok", { ms: Date.now() - started, confidence: result.confidence });
    return json(result);
  } catch (e) {
    console.error("[describe-meal]", reqId, "Unhandled error", String(e?.message ?? e));
    return json({ error: String(e?.message ?? e) }, 500);
  }
});


