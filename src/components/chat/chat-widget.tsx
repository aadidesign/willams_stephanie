"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle, X, Send, ChevronDown, RotateCcw, ArrowUpRight,
  Phone, CalendarHeart, UtensilsCrossed, Clock, MapPin, Sparkles,
} from "lucide-react";
import { siteContent } from "@/content/site";
import { ChatBooking, type BookingResult } from "./chat-booking";

type Msg = { role: "user" | "assistant"; content: string; at: string };

// Resolve the chatbot endpoint. Tolerates the URL being set to the service
// root (e.g. ".../onrender.com" or trailing slash) by appending "/chat".
function resolveChatUrl(raw?: string): string {
  if (!raw) return "/api/chat";
  const u = raw.trim().replace(/\/+$/, "");
  if (!u) return "/api/chat";
  return /\/chat$/.test(u) ? u : `${u}/chat`;
}
const CHAT_URL = resolveChatUrl(process.env.NEXT_PUBLIC_CHATBOT_URL);

const QUICK = [
  { label: "Book a table", icon: CalendarHeart, action: "book" as const },
  { label: "See the menu & prices", icon: UtensilsCrossed, action: "menu" as const },
  { label: "Opening hours", icon: Clock, action: "hours" as const },
  { label: "Where are you located?", icon: MapPin, action: "find" as const },
];

const now = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const welcome = (): Msg => ({
  role: "assistant",
  content: `Buongiorno, welcome to ${siteContent.brand.name}! I'm Bella, your concierge. I can help with our menu, hours, dietary options and events, or book you a table right here. How may I help?`,
  at: now(),
});

function firstName(n: string) {
  return n.trim().split(" ")[0] || "there";
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => [welcome()]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [booking, setBooking] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string>(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `s_${Date.now()}_${Math.round(performance.now())}`
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, booking]);

  useEffect(() => {
    const onScroll = () => setScrolledPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = scrolledPastHero || open;

  function logMsg(role: Msg["role"], content: string) {
    fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionId.current, role, content }),
    }).catch(() => {});
  }

  function push(role: Msg["role"], content: string) {
    setMessages((m) => [...m, { role, content, at: now() }]);
    logMsg(role, content);
  }

  function reset() {
    setBooking(false);
    setMessages([welcome()]);
    sessionId.current =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `s_${Date.now()}_${Math.round(performance.now())}`;
  }

  function openBooking() {
    setBooking(true);
    push("assistant", "Wonderful! Let's reserve your table. Pick your party size and date below and I'll show you live availability.");
  }

  function onBookingDone(r: BookingResult) {
    setBooking(false);
    const when = new Date(r.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    push(
      "assistant",
      `All set, ${firstName(r.name)}! Your reservation #${r.ref} for ${r.partySize} on ${when} is in and marked pending. ${r.table ? `We've earmarked table ${r.table}. ` : ""}Our team will call you shortly to confirm. Anything else I can help with?`
    );
  }

  async function callLLM(text: string, history: Msg[]) {
    setTyping(true);
    const body = JSON.stringify({
      message: text,
      history: history.map((m) => ({ role: m.role, content: m.content })),
    });
    const ask = async (url: string) => {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
      if (!res.ok) throw new Error(`status ${res.status}`);
      return res.json();
    };
    try {
      let data;
      try {
        data = await ask(CHAT_URL);
      } catch {
        // Self-heal: if the external chatbot (Render) is asleep/misconfigured,
        // fall back to the same-origin /api/chat route so Bella still answers.
        if (CHAT_URL !== "/api/chat") data = await ask("/api/chat");
        else throw new Error("unreachable");
      }
      push("assistant", data?.reply || "…");
    } catch {
      push("assistant", `I'm having a little trouble connecting right now. Please try again in a moment, or call us at ${siteContent.contact.phone}.`);
    } finally {
      setTyping(false);
    }
  }

  function send(text: string) {
    const content = text.trim();
    if (!content || typing || booking) return;
    const history = messages;
    push("user", content);
    setInput("");
    if (/\b(book|booking|reserve|reservation|table|availabilit)/i.test(content)) {
      setTimeout(openBooking, 250);
      return;
    }
    callLLM(content, history);
  }

  function quick(action: (typeof QUICK)[number]["action"], label: string) {
    if (booking || typing) return;
    if (action === "book") {
      push("user", "I'd like to book a table.");
      setTimeout(openBooking, 200);
    } else {
      send(label);
    }
  }

  const showStarters = !booking && messages.length <= 1;

  return (
    <>
      {/* Launcher (toggles to chevron-down while open, à la reference UIs) */}
      <motion.button
        aria-label={open ? "Minimize chat" : "Chat with Bella, our concierge"}
        onClick={() => setOpen((o) => !o)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ pointerEvents: visible ? "auto" : "none" }}
        className={`group fixed bottom-5 right-5 z-[80] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-terracotta to-terracotta-dark text-cream shadow-[0_16px_36px_-10px_rgba(156,59,34,0.8)] sm:bottom-6 sm:right-6 sm:h-[68px] sm:w-[68px] ${open ? "max-sm:hidden" : ""}`}
      >
        {!open && <span className="animate-ping-slow absolute inset-0 rounded-full bg-terracotta" />}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="down" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <ChevronDown className="h-7 w-7" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="relative h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 right-0 z-[75] flex h-[100svh] w-full flex-col overflow-hidden bg-[#f7f2e9] shadow-2xl sm:bottom-[96px] sm:right-6 sm:h-[680px] sm:max-h-[84vh] sm:w-[400px] sm:rounded-[26px] sm:border sm:border-ink/10"
          >
            {/* Header */}
            <div className="relative shrink-0 overflow-hidden px-5 pb-4 pt-4 text-cream">
              <div className="absolute inset-0 bg-gradient-to-br from-ink via-[#5a3520] to-terracotta" />
              <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-gold/15 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 font-display text-xl text-cream ring-2 ring-gold/50">
                    B
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display text-lg leading-none tracking-wide">Bella</p>
                      <span className="rounded-full bg-gold/25 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gold-light">AI</span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.15em] text-cream/75">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Concierge · replies instantly
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={reset} aria-label="Restart conversation" className="rounded-full p-2 text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream">
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-2 text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    {m.role === "assistant" && (
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-terracotta to-terracotta-dark font-display text-[11px] text-cream">B</span>
                    )}
                    <div
                      className={`max-w-[78%] px-4 py-2.5 font-body text-sm leading-relaxed shadow-sm ${
                        m.role === "user"
                          ? "rounded-2xl rounded-br-md bg-terracotta text-cream"
                          : "rounded-2xl rounded-bl-md border border-ink/8 bg-white text-ink"
                      }`}
                    >
                      {m.role === "assistant" ? renderRich(m.content) : m.content}
                    </div>
                  </div>
                  <span className={`mt-1 px-1 font-body text-[10px] text-ink/35 ${m.role === "user" ? "mr-1" : "ml-9"}`}>{m.at}</span>
                </div>
              ))}

              {typing && (
                <div className="flex items-end gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-terracotta to-terracotta-dark font-display text-[11px] text-cream">B</span>
                  <div className="flex gap-1.5 rounded-2xl rounded-bl-md border border-ink/8 bg-white px-4 py-3.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-ink/40"
                        animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Starters — full-width rows with leading icon + trailing arrow */}
              {showStarters && (
                <div className="pt-1">
                  <p className="mb-2 flex items-center gap-1.5 px-1 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dark">
                    <Sparkles className="h-3.5 w-3.5" /> Try asking
                  </p>
                  <div className="space-y-2">
                    {QUICK.map((q) => (
                      <button
                        key={q.label}
                        onClick={() => quick(q.action, q.label)}
                        className="group/row flex w-full items-center gap-3 rounded-xl border border-ink/8 bg-white px-3.5 py-3 text-left shadow-sm transition-all hover:border-terracotta/40 hover:shadow-md"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                          <q.icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1 font-body text-sm text-ink">{q.label}</span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/5 text-ink/50 transition-colors group-hover/row:bg-terracotta group-hover/row:text-cream">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Inline secure booking */}
              {booking && (
                <ChatBooking
                  onDone={onBookingDone}
                  onCancel={() => { setBooking(false); push("assistant", "No problem! I'm here whenever you'd like to book. Anything else?"); }}
                />
              )}
            </div>

            {/* Secondary action */}
            <a href={siteContent.contact.phoneHref} className="flex shrink-0 items-center justify-center gap-2 border-t border-ink/10 bg-white/60 py-2.5 font-body text-xs text-ink-mute transition-colors hover:text-terracotta">
              <Phone className="h-3.5 w-3.5 text-terracotta" /> Prefer to call? {siteContent.contact.phone}
            </a>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex shrink-0 items-center gap-2 border-t border-ink/10 bg-white p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={booking}
                placeholder={booking ? "Finish your booking above…" : "Ask about the menu, hours, a table…"}
                className="flex-1 rounded-full bg-cream px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-terracotta/30 disabled:opacity-50"
              />
              <button type="submit" disabled={!input.trim() || typing || booking} aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-terracotta to-terracotta-dark text-cream transition-all hover:brightness-110 disabled:opacity-40">
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="shrink-0 bg-white pb-2 text-center font-body text-[10px] text-ink/35">
              Bella is an AI assistant · for changes call {siteContent.contact.phone}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- Lightweight markdown rendering for bot replies ---------- */

// Linkify in-app /paths within a text run.
function linkify(text: string, kp: string) {
  return text.split(/(\/[a-z-]+)/g).map((p, i) =>
    /^\/[a-z-]+$/.test(p) ? (
      <a key={`${kp}-l${i}`} href={p} className="font-semibold text-terracotta underline underline-offset-2">{p}</a>
    ) : (
      <span key={`${kp}-s${i}`}>{p}</span>
    )
  );
}

// Parse **bold** (and links) inside a single line.
function inline(text: string, kp: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(...linkify(text.slice(last, m.index), `${kp}-${i++}`));
    out.push(
      <strong key={`${kp}-b${i++}`} className="font-semibold text-ink">
        {linkify(m[1], `${kp}-bi${i}`)}
      </strong>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(...linkify(text.slice(last), `${kp}-${i++}`));
  return out;
}

// Strip emojis/pictographs — we rely on lucide icons for visual language.
function stripEmoji(text: string) {
  return text
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{200D}]/gu, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

// Render a reply with paragraphs, bullet lists, simple headings and bold.
function renderRich(input: string) {
  const text = stripEmoji(input);
  const lines = text.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let key = 0;

  const flushList = () => {
    if (list.length) {
      const items = list;
      blocks.push(
        <ul key={`ul${key++}`} className="my-1.5 ml-1 space-y-1">
          {items.map((li, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-terracotta" />
              <span>{inline(li, `li${key}-${idx}`)}</span>
            </li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  lines.forEach((raw, li) => {
    const t = raw.trim();
    const bullet = t.match(/^(?:[-*•]|\d+\.)\s+(.*)/);
    const heading = t.match(/^#{1,3}\s+(.*)/);
    if (bullet) {
      list.push(bullet[1]);
    } else {
      flushList();
      if (heading) {
        blocks.push(<p key={`h${key++}`} className="mt-2 font-display text-[15px] text-ink">{inline(heading[1], `h${li}`)}</p>);
      } else if (t) {
        blocks.push(<p key={`p${key++}`} className={blocks.length ? "mt-2" : ""}>{inline(t, `p${li}`)}</p>);
      }
    }
  });
  flushList();
  return <div>{blocks}</div>;
}
