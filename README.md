# Gemini CLI Web

A mobile-friendly web interface for Google Gemini, deployed as a secure serverless app on Vercel. Chat with Gemini from your iPhone (or any browser) — no local CLI needed.

---

## Features

- **Password-protected** — single shared password, validated server-side on every request
- **Chat interface** — multi-turn conversations with full markdown + code highlighting
- **Model switcher** — pick any Gemini model at runtime (no redeploy needed)
- **System prompt** — optional system instruction stored in your browser
- **Stats & ping** — live API connectivity check and session token counts
- **Mobile-first** — safe-area aware, iOS home-bar friendly, works as a PWA

---

## Quick Start

### 1. Get a Gemini API Key

Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free API key.

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Your Gemini API key from AI Studio |
| `APP_PASSWORD` | ✅ | Password for the web UI lock screen |
| `DEFAULT_MODEL` | optional | Override default model (default: `gemini-2.0-flash`) |
| `DEFAULT_SYSTEM_PROMPT` | optional | System instruction prepended to every chat |

### 4. Run locally

```bash
npm run dev
```

Opens at `http://localhost:3000`. Enter your `APP_PASSWORD` to unlock.

### 5. Deploy to Vercel

```bash
npm run deploy
```

Or push to GitHub and connect the repo in the [Vercel dashboard](https://vercel.com/new).

**Add your environment variables in Vercel:**
- `Settings → Environment Variables`
- Add `GEMINI_API_KEY` and `APP_PASSWORD` (mark as secret)
- Optionally add `DEFAULT_MODEL` and `DEFAULT_SYSTEM_PROMPT`

---

## Project Structure

```
├── api/
│   ├── _auth.js      # Shared password-check middleware
│   ├── chat.js       # POST /api/chat — send prompt, get response
│   ├── stats.js      # GET  /api/stats — connectivity ping
│   └── model.js      # GET  /api/model — list available models
├── public/
│   └── index.html    # Full SPA (lock screen + chat + model + stats tabs)
├── .env.example
├── vercel.json
└── package.json
```

---

## API Reference

All endpoints require the `X-Password` header matching `APP_PASSWORD`.

### `POST /api/chat`

```json
{
  "prompt": "What is the capital of France?",
  "model": "gemini-2.0-flash",
  "history": [],
  "system": "You are a concise assistant."
}
```

Response:
```json
{
  "ok": true,
  "model": "gemini-2.0-flash",
  "text": "Paris.",
  "usage": { "promptTokens": 12, "completionTokens": 2, "totalTokens": 14 }
}
```

### `GET /api/stats`

Returns connectivity status (runs a ping prompt to verify the key is working).

### `GET /api/model`

Returns the list of available models and the current default.

---

## Available Models

| Model ID | Notes |
|---|---|
| `gemini-2.5-pro-preview-03-25` | Highest capability, 1M context |
| `gemini-2.0-flash` | **Default** — best balance of speed & quality |
| `gemini-2.0-flash-lite` | Fastest, cheapest |
| `gemini-1.5-pro` | 1M context, stable |
| `gemini-1.5-flash` | Fast, 1M context |
| `gemini-1.5-flash-8b` | Smallest & fastest |

---

## Security Notes

- The password is checked on **every API call** server-side — it is never embedded in the page source
- Your `GEMINI_API_KEY` is only ever read in serverless functions, never sent to the browser
- For extra security, deploy to a private Vercel project and use a long random password
- Session password is kept in `sessionStorage` only (cleared when browser tab closes)

---

## Add to iPhone Home Screen (PWA)

1. Open your Vercel URL in Safari
2. Tap the Share button → **Add to Home Screen**
3. Name it "Gemini CLI" and tap Add
4. Launch it like a native app

---

## License

MIT
