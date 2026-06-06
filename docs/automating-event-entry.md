# Automating Event Entry — Evaluation & Notes

> Status: **Idea / not built.** This is a decision document to revisit later. Nothing
> in here has been implemented. Created from a planning discussion (2026-06-06).

## Goal

Make it easier/faster for the **event manager** (a separate, non-technical person who
currently adds events only through the Contentful web UI) to add/update events —
ideally from a phone, with a photo, conversationally. Hard constraint: **everything
must stay on free tiers ($0).**

---

## Current setup (what we have to work with)

| Piece | Role | Notes |
|---|---|---|
| **Contentful CMS** | Source of truth for events | `event` content type. Fields: `date`, `venue`, `heading`, `cover` (image), `venueLogo`, `doorsOpen`, `address` (lat/lon), `gallery`, `content`, `excerpt`, `price`. See [`types/events.ts`](../types/events.ts). |
| **Contentful Management API** | Programmatic create/publish + asset upload | Token already in `.env` (`CONTENTFUL_MANAGEMENT_TOKEN`). `.env` is gitignored & untracked ✅ |
| **Webhooks** | Notify the site *after* a change | Existing revalidate webhook → [`app/api/revalidate/route.ts`](../app/api/revalidate/route.ts). **Outbound only** (Contentful → site). |
| **Cloudinary** (free tier) | Image hosting | `CLOUDINARY_CLOUD_NAME` configured. |
| **Netlify Functions** (free tier) | Serverless compute | Hosting platform (`netlify.toml`). |
| **Stack** | Next.js 16 (App Router), TS, hosted on Netlify | — |

**No custom admin UI today.** Writes happen only via Contentful's web app, or
programmatically via the Management API.

---

## Key conceptual clarifications

1. **MCP is not the right tool here.** MCP (e.g. Contentful's MCP server) connects an
   **LLM client** (Claude Code/Desktop, Cursor) to a tool server. It would work great for
   *me/the website owner* editing from a Claude client, but it's a developer tool — a
   non-technical event manager won't use it, and it isn't free for them. **MCP is off the
   table for the client-facing flow.**

2. **Webhooks are the wrong direction for *input*.** A webhook fires *out of* Contentful
   when content changes. It cannot be used to *add* an event. The existing revalidate
   webhook is the *last* step of the pipeline (auto-refresh the live site), not the entry
   point.

3. **WhatsApp can't be free.** It requires a paid Meta Business API provider / BSP. Ruled
   out by the $0 constraint. **Telegram is the free messaging channel.**

4. **Natural-language parsing needs an LLM, which isn't free** (Claude/OpenAI APIs are
   pay-per-token). To stay free you'd either (a) use a **guided Q&A flow with no LLM**, or
   (b) use a **free LLM tier** (Gemini/Groq) with rate-limit + data-use caveats.

---

## The pipeline (if built)

```
[ client input channel ]  →  [ Netlify Function ]  →  Contentful Management API (create + publish)
                                      |
                                      └─ upload photo → Cloudinary
                                                                  |
                                        existing revalidate webhook → live site updates
```

The **new part** to build = the input channel + Netlify Function. The publish→site-refresh
tail already exists.

---

## Options compared

| Option | Free? | Photo from phone | Effort | Verdict |
|---|---|---|---|---|
| **Status quo (Contentful web UI)** | ✅ | ⚠️ clunky on mobile | none | Fine if the editor isn't actually struggling. |
| **Telegram bot — guided Q&A flow (no LLM)** | ✅ **fully** | ✅ native | medium | **Recommended.** Reliable, truly free. |
| Telegram bot — natural language (free LLM tier) | ✅-ish | ✅ | medium+ | Possible, but rate limits + data-use caveats + occasional misparse. |
| WhatsApp bot | ❌ (paid BSP) | ✅ | high | Ruled out by $0 constraint. |
| Contentful MCP in a Claude client | ✅ for owner only | ⚠️ | low | Only for *me*, not the client. |
| Simple web form | ✅ | ✅ | medium | Works, but another URL/login; less "chat-like". |

**Recommendation:** Telegram bot with a **guided step-by-step flow** ("Event name? → Date?
→ Venue? → Price? → Send photo"). No LLM = $0 and far more reliable (no misread
dates/prices). Add free-tier NL later only if the client insists on free-form typing.

---

## Security / threat model (important — read before building)

Building this creates **one real new vulnerability**: the Netlify Function must be a
**public URL** (Telegram POSTs to it from the internet) and it holds **write-access to the
CMS**. So it's a public endpoint in front of your live site. Naively built, anyone who
finds the URL could publish junk.

### What an attacker could try
1. Forge requests directly to the function URL (bypass Telegram).
2. DM the bot — by default *any* Telegram user can reach any bot.
3. Abuse token blast radius — a classic management token can touch the **whole space**, not
   just events.
4. Spam/DoS the public endpoint (burn free-tier quota / Contentful rate limits).
5. Malicious payloads (oversized files, HTML/script injection into rendered fields).

### Defense layers (all free)

| # | Layer | Closes | How |
|---|---|---|---|
| 1 | **Telegram secret token** | forged requests | Set `secret_token` on `setWebhook`; verify the `X-Telegram-Bot-Api-Secret-Token` header on every request; reject mismatches. |
| 2 | **User allowlist** | random Telegram users | Hardcode the client's Telegram chat ID; reject all others immediately. |
| 3 | **Scoped Contentful "bot" role** ⭐ | blast radius | **Do NOT use the personal management token.** Create a dedicated Contentful member with a role limited to the `event` content type + assets, and use *its* token. Even a full breach is then contained to events only. **Non-negotiable.** |
| 4 | **Input validation + limits** | bad payloads | Cap image size/type (Cloudinary handles transforms); store text as **plain-text** fields (no raw HTML); validate dates/prices before writing. Site uses Contentful's rich-text renderer (safe by default) — don't add a raw-HTML field. |
| 5 | **Fast-reject + dedupe** | spam/replay | Layers 1+2 reject bad traffic in a few lines before heavy work; dedupe on Telegram `update_id`. |
| 6 | **Draft-then-confirm** (optional) | mistakes/abuse | Create as draft + require a "publish?" confirm step instead of auto-publishing. Contentful keeps version history either way (rollback always possible). |

**Bottom line:** real but well-understood surface, fully closable. Layers **1 + 2 + 3** are
the must-haves.

---

## If/when we build it — checklist

- [ ] Confirm the exact Contentful `event` field IDs + required fields (so entries validate).
- [ ] Create a **scoped Contentful bot user + role** (events + assets only) → get its token (Layer 3).
- [ ] Create the bot via Telegram **@BotFather**; get the bot token.
- [ ] Get the client's Telegram **chat ID** for the allowlist (Layer 2).
- [ ] Netlify Function `/api/telegram-webhook`:
  - [ ] Verify Telegram secret-token header (Layer 1).
  - [ ] Allowlist check (Layer 2).
  - [ ] Guided Q&A state machine (no LLM).
  - [ ] Photo → Cloudinary upload (or Contentful asset).
  - [ ] Create + (optionally draft-then-) publish event via scoped CMA token.
  - [ ] Input validation + size/type limits (Layer 4); dedupe on `update_id` (Layer 5).
- [ ] Register the Telegram webhook with `secret_token`.
- [ ] Store all tokens in Netlify env vars (never in repo / never `NEXT_PUBLIC_`).
- [ ] Test end-to-end; confirm existing revalidate webhook refreshes the live site.

---

## Open decision to settle later

The whole thing is only worth building if the event manager is **actually** finding
Contentful painful (esp. adding events + photos from a phone). If it's fine for them,
**keep the status quo and build nothing.** Decide that before investing the effort.
