import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, fallbackReply, business } from "./knowledge.js";

const app = express();
const PORT = process.env.PORT || 8080;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Restrict CORS to the website origin(s) in production via ALLOWED_ORIGINS.
const allowed = (process.env.ALLOWED_ORIGINS || "*")
  .split(",")
  .map((s) => s.trim());
app.use(
  cors({
    origin: allowed.includes("*") ? true : allowed,
  })
);
app.use(express.json({ limit: "1mb" }));

const ai = GEMINI_KEY ? new GoogleGenAI({ apiKey: GEMINI_KEY }) : null;

app.get("/", (_req, res) => {
  res.json({ service: "bellavita-chatbot", status: "ok", model: MODEL, geminiConfigured: Boolean(GEMINI_KEY) });
});

app.get("/health", (_req, res) => res.json({ status: "healthy" }));

app.post("/chat", async (req, res) => {
  const { message, history = [] } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ ok: false, error: "message required" });
  }

  if (ai) {
    try {
      const contents = [
        ...history.slice(-8).map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: String(m.content || "") }],
        })),
        { role: "user", parts: [{ text: message }] },
      ];
      const response = await ai.models.generateContent({
        model: MODEL,
        contents,
        config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.6, maxOutputTokens: 600 },
      });
      const reply = response.text?.trim() || fallbackReply(message);
      return res.json({ ok: true, reply, source: "gemini" });
    } catch (err) {
      console.error("[chat] Gemini error:", err?.message || err);
    }
  }

  return res.json({ ok: true, reply: fallbackReply(message), source: "fallback" });
});

app.listen(PORT, () => {
  console.log(`🍝 ${business.name} chatbot listening on :${PORT} (gemini=${Boolean(GEMINI_KEY)})`);
});
