# 🍝 Bella Vita Ristorante — Premium Restaurant Website

A production-ready, fully-managed website for an Italian fine-dining restaurant — built to **replace WordPress** with a faster, more elegant, fully-custom platform.

Built for client **Willams Stephanie**.

---

## ✨ What's included

### Public website (9 pages)
- **Home** — cinematic video hero, since-1978 story, values, live visiting hours, signature dishes, happy-hour promo, banquet/catering teasers, gallery, testimonials carousel, reservation CTA
- **About** — story, stats, philosophy, chef
- **Menu** — interactive category explorer with prices, happy-hour banner
- **Banquet Facility** — spaces, capacity, inclusions
- **Gallery** — filterable masonry grid with lightbox
- **Catering** — services, per-guest packages, process
- **Menu Kit** — downloadable menus **+ website hosting plans** (no shopping cart)
- **Contact & Visiting Hours** — info cards, live open/closed status, contact form, map, FAQ
- **Online Booking** — multi-step reservation flow with real-time availability

### Advanced features
- 🤖 **AI Concierge Chatbot** (Gemini Flash 2.5) — trained on the full business knowledge base; answers any question about menu, hours, booking, banquets, catering. Floating widget + standalone Render service.
- 📊 **Admin Dashboard** (replaces WordPress) — overview with charts, bookings management, message inbox, **live CMS** for content/menu/gallery editing, image reordering. Password-protected.
- 📅 **Dynamic bookings** — real-time slot availability, saved to MongoDB, owner notified by **EmailJS**, shown in the dashboard, and exportable to **Google Calendar / .ics** (3rd-party sync).
- 📧 EmailJS owner notifications for bookings & enquiries.
- 🎨 Premium motion design (Framer Motion), fully mobile-responsive, SEO metadata.

---

## 🧱 Tech stack
| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + custom Italian fine-dining design system |
| UI (admin) | shadcn/ui |
| Animation | Framer Motion |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini Flash 2.5 (`@google/genai`) |
| Email | EmailJS |
| Icons | lucide-react |

---

## 🚀 Getting started

```bash
npm install
cp .env.example .env.local   # optional — runs in demo mode without keys
npm run dev
```

Open http://localhost:3000 — and the dashboard at http://localhost:3000/admin (password: `bellavita`).

> **Demo mode:** with no `.env` keys, the site is fully interactive — the chatbot uses a smart keyword fallback, bookings/messages save to an in-memory store, and email notifications are logged to the console. Add keys to go live.

---

## 🔑 Going live (add to `.env.local` / Vercel)
- `MONGODB_URI` — persist bookings, messages & CMS edits
- `GEMINI_API_KEY` — power the AI chatbot
- `NEXT_PUBLIC_EMAILJS_*` — owner email notifications
- `ADMIN_PASSWORD` — change the dashboard password

See `.env.example` for the full list with links.

---

## ☁️ Deployment
- **Website → Vercel.** Import the repo, add env vars, deploy.
- **AI chatbot → Render.** See [`chatbot-service/README.md`](./chatbot-service/README.md). After deploying, set `NEXT_PUBLIC_CHATBOT_URL` on Vercel to the Render `/chat` URL.

---

## 📝 Editing content
All site copy, menu, prices, images and hours live in **`src/content/site.ts`** and are editable live from the **Admin → Content / Menu / Gallery** pages (saved to MongoDB). For anything structural, your developer is one message away.

---

## 📁 Project structure
```
src/
  app/
    (site)/        # public pages (shared navbar/footer/chat)
    admin/         # password-protected dashboard
    api/           # bookings, availability, contact, chat, content, admin
  components/      # sections, menu, gallery, booking, chat, admin, ui (shadcn)
  content/site.ts  # ← single source of truth for all content
  lib/             # db, models, content resolver, hours, emailjs, knowledge-base
chatbot-service/   # standalone Gemini service for Render
```
