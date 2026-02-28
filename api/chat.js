import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkAuth } from "./_auth.js";

/**
 * POST /api/chat
 * Body: { prompt: string, model?: string, history?: Array<{role, parts}>, system?: string }
 * Headers: X-Password
 *
 * Streams or returns the Gemini response.
 */
export default async function handler(req, res) {
  if (!checkAuth(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const {
    prompt,
    model = process.env.DEFAULT_MODEL || "gemini-2.0-flash",
    history = [],
    system = process.env.DEFAULT_SYSTEM_PROMPT || "",
  } = req.body || {};

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "prompt is required." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not set." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const generativeModel = genAI.getGenerativeModel({
      model,
      ...(system ? { systemInstruction: system } : {}),
    });

    // Build history in Gemini SDK format
    const formattedHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = generativeModel.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 8192,
      },
    });

    const result = await chat.sendMessage(prompt.trim());
    const responseText = result.response.text();

    const usageMetadata = result.response.usageMetadata || {};

    return res.status(200).json({
      ok: true,
      model,
      text: responseText,
      usage: {
        promptTokens: usageMetadata.promptTokenCount ?? null,
        completionTokens: usageMetadata.candidatesTokenCount ?? null,
        totalTokens: usageMetadata.totalTokenCount ?? null,
      },
    });
  } catch (err) {
    console.error("[/api/chat] Error:", err);
    return res.status(500).json({
      error: err.message || "Unknown error from Gemini API.",
    });
  }
}
