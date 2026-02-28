import { checkAuth } from "./_auth.js";

/**
 * GET /api/model
 * Headers: X-Password
 *
 * Returns the list of supported Gemini models with descriptions,
 * and the currently configured default model.
 */

const MODELS = [
  {
    id: "gemini-2.5-pro-preview-03-25",
    name: "Gemini 2.5 Pro (Preview)",
    description: "Most capable — complex reasoning, long context (1M tokens). Best quality.",
    tier: "pro",
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: "Fast & versatile — multimodal, low latency, best balance. Recommended.",
    tier: "flash",
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    description: "Most efficient — ultra-low cost and latency for high-volume tasks.",
    tier: "flash",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    description: "1M token context, strong multimodal reasoning. Stable.",
    tier: "pro",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Fast, efficient, 1M context. Good for summarization and chat.",
    tier: "flash",
  },
  {
    id: "gemini-1.5-flash-8b",
    name: "Gemini 1.5 Flash 8B",
    description: "Smallest & fastest. Great for simple tasks.",
    tier: "flash",
  },
];

export default function handler(req, res) {
  if (!checkAuth(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const currentModel = process.env.DEFAULT_MODEL || "gemini-2.0-flash";

  return res.status(200).json({
    ok: true,
    current: currentModel,
    models: MODELS,
  });
}
