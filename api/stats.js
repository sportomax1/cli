import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkAuth } from "./_auth.js";

/**
 * GET /api/stats
 * Headers: X-Password
 *
 * Returns runtime info: configured model, available models count,
 * and a lightweight "ping" to Gemini to confirm API connectivity.
 */
export default async function handler(req, res) {
  if (!checkAuth(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not set." });
  }

  const defaultModel = process.env.DEFAULT_MODEL || "gemini-2.0-flash";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Quick connectivity check using a tiny prompt
    const model = genAI.getGenerativeModel({ model: defaultModel });
    const ping = await model.generateContent("Reply with only the word: pong");
    const pingText = ping.response.text().trim();

    return res.status(200).json({
      ok: true,
      configured: {
        model: defaultModel,
        systemPrompt: process.env.DEFAULT_SYSTEM_PROMPT || "(none)",
        hasApiKey: !!apiKey,
      },
      connectivity: {
        status: "connected",
        ping: pingText,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[/api/stats] Error:", err);
    return res.status(500).json({
      ok: false,
      configured: {
        model: defaultModel,
        hasApiKey: !!apiKey,
      },
      connectivity: {
        status: "error",
        error: err.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
