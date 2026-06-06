# Bella Vita — AI Concierge Service

Standalone Gemini Flash 2.5 chatbot, designed to deploy to **Render** independently of the Next.js website (which deploys to Vercel).

## Endpoints
- `GET /` — service info
- `GET /health` — health check (used by Render)
- `POST /chat` — body `{ "message": string, "history": [{ "role": "user"|"assistant", "content": string }] }` → `{ ok, reply, source }`

## Local run
```bash
cd chatbot-service
cp .env.example .env   # add your GEMINI_API_KEY
npm install
npm run dev
```

## Deploy to Render
1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, point at the repo (it reads `chatbot-service/render.yaml`), or **New → Web Service** with root dir `chatbot-service`, build `npm install`, start `npm start`.
3. Set env vars: `GEMINI_API_KEY`, `ALLOWED_ORIGINS` (your Vercel URL), optional `GEMINI_MODEL`.
4. Copy the live URL (e.g. `https://bellavita-chatbot.onrender.com`).
5. In the **website's** Vercel env, set `NEXT_PUBLIC_CHATBOT_URL=https://bellavita-chatbot.onrender.com/chat`.

Without a key the service still replies via a smart keyword fallback, so the widget works in demo mode.

## Keeping the knowledge base in sync
Business facts live in `knowledge.js` and mirror the website's `src/content/site.ts`. Update both if hours, menu or pricing change.
