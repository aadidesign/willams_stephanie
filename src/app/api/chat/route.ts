import { NextResponse } from "next/server";
import { buildKnowledgeBase } from "@/lib/knowledge-base";
import { siteContent } from "@/content/site";
import { formatTime } from "@/lib/hours";

type ChatMessage = { role: "user" | "assistant" | "model"; content: string };

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function POST(req: Request) {
  try {
    const { message, history = [] } = (await req.json()) as {
      message: string;
      history?: ChatMessage[];
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json({ ok: false, error: "message required" }, { status: 400 });
    }

    const kb = buildKnowledgeBase();

    // ---- Gemini path ----
    if (GEMINI_KEY) {
      try {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
        const contents = [
          ...history.slice(-8).map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          { role: "user", parts: [{ text: message }] },
        ];
        const response = await ai.models.generateContent({
          model: MODEL,
          contents,
          config: {
            systemInstruction: kb,
            temperature: 0.6,
            maxOutputTokens: 600,
          },
        });
        const reply = response.text?.trim() || fallbackReply(message);
        return NextResponse.json({ ok: true, reply, source: "gemini" });
      } catch (err) {
        console.error("[api/chat] Gemini error, using fallback:", err);
      }
    }

    // ---- Fallback path (demo mode / no key) ----
    return NextResponse.json({ ok: true, reply: fallbackReply(message), source: "fallback" });
  } catch (err) {
    console.error("[api/chat] error:", err);
    return NextResponse.json(
      { ok: false, reply: "Apologies, I'm having a moment. Please call us at " + siteContent.contact.phone + "." },
      { status: 500 }
    );
  }
}

/** Lightweight keyword responder so the assistant is useful before a key is added. */
function fallbackReply(msg: string): string {
  const m = msg.toLowerCase();
  const c = siteContent;

  if (/hour|open|close|timing|when.*open/.test(m)) {
    const today = c.hours.find((h) => h.day === ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()]);
    const t = today && !today.closed ? `Today we're open ${formatTime(today.open)}–${formatTime(today.close)}.` : "We're closed today.";
    return `${t} You can see our full visiting hours on the Contact page. Shall I help you book a table?`;
  }
  if (/book|reserv|table|availab/.test(m)) {
    return `I'd love to help you reserve a table! You can book online in seconds at /booking. Choose your date, time and party size for instant confirmation, or call us at ${c.contact.reservationsPhone}.`;
  }
  if (/menu|dish|pasta|pizza|eat|food|vegan|vegetarian|gluten/.test(m)) {
    const sig = c.menu.flatMap((x) => x.items).filter((i) => i.featured).slice(0, 3).map((i) => i.name).join(", ");
    return `Our menu spans antipasti, hand-rolled pasta, wood-fired pizza, secondi and dolci. Guest favourites include ${sig}. We have vegetarian, vegan and gluten-free options too. See the full menu at /menu.`;
  }
  if (/cater/.test(m)) {
    return `We cater weddings, corporate events and private dining. Packages start at ${c.brand.currency}${c.catering.packages[0].price} ${c.catering.packages[0].unit}. Visit /catering or email ${c.contact.cateringEmail} for a custom quote.`;
  }
  if (/banquet|event|wedding|party|private room/.test(m)) {
    return `Our banquet facility seats up to ${c.banquet.capacity.seated} (${c.banquet.capacity.standing} standing) across ${c.banquet.capacity.privateRooms} private rooms. Take a look at /banquet, or I can connect you with our events team.`;
  }
  if (/where|location|address|direction|park/.test(m)) {
    return `You'll find us at ${c.contact.addressLine}. Valet parking is available Thursday–Sunday evenings. Directions: ${c.contact.mapLink}`;
  }
  if (/phone|call|contact|email/.test(m)) {
    return `You can reach us at ${c.contact.phone} or ${c.contact.email}. How else may I help?`;
  }
  if (/host|website|price|plan|wordpress/.test(m)) {
    return `Our managed website plans start at ${c.brand.currency}${c.hosting.plans[0].price}${c.hosting.plans[0].period}, all-inclusive with no shopping cart. See /menu-kit for details.`;
  }
  if (/hello|hi|hey|buongiorno|ciao/.test(m)) {
    return `Buongiorno! Welcome to ${c.brand.name}. I can help with our menu, hours, reservations, banquets or catering. What would you like to know?`;
  }
  return `Grazie for your message! I can help with our menu, visiting hours, reservations, banquets and catering. For anything else, our team is a call away at ${c.contact.phone}. Would you like to book a table?`;
}

export const dynamic = "force-dynamic";
