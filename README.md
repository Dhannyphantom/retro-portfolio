# Daniel Olojo — Portfolio (Next.js + MongoDB)

A full-stack developer portfolio: cinematic dark/purple design system, every piece of
content editable in an admin dashboard, real client accounts with a project-management
dashboard (budget, milestones, negotiation chat), file uploads, and transactional email.

Every public page degrades gracefully with built-in demo content if the database isn't
configured yet — clone it, `npm install`, `npm run dev`, and it looks complete immediately.
Connect MongoDB and run `npm run seed` once to load that same demo content *into* the
database, at which point everything becomes editable from `/admin`.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + TypeScript
- **Tailwind CSS** for styling · **Framer Motion** for scroll reveals, entrance animation, and drag interactions
- **MongoDB + Mongoose** for content
- **jose** (JWT) + **bcryptjs** — two independent lightweight auth systems (admin + client),
  no external auth provider
- **Cloudflare R2** (via `@aws-sdk/client-s3`, S3-compatible) for file uploads
- **Brevo** REST API for transactional email (no SMTP setup)
- **Zod** for API input validation

## Design: retro CRT-terminal theme

The entire UI was re-skinned to an 80s/90s computer-terminal aesthetic — same content and
backend logic as before, completely different visual language. A few things worth knowing
if you're extending it:

- **Palette lives in two places, kept in sync**: `tailwind.config.ts` (semantic tokens —
  `ink`=void black, `ink2`=panel, `purple`=phosphor green, `violet`=cyan, plus `magenta`/
  `amber`) and CSS variables in `globals.css` (`--void`, `--green`, `--cyan`, etc., used by
  hand-written CSS classes like `.win` and `.retro-btn`). The token *names* (`purple`,
  `violet`) are historical — they're green and cyan now, kept unrenamed so the hundreds of
  existing `text-violet` / `bg-purple` usages across the app didn't all need touching.
- **Global overrides do a lot of the work**: `globals.css` forces `border-radius: 0` and
  disables `cursor` everywhere via blanket rules (an `!important` CSS rule beats an inline
  style, which is what makes a two-line global change retro-fit dozens of components at
  once). `.retro-circle` opts a specific element back into a circle if you ever need one.
- **`DiagonalCard` is now a retro "window"** (`src/components/ui/DiagonalCard.tsx`) — a
  flat bordered panel with an optional OS-style title bar (`title` prop) and a "marching
  ants" dashed border that lights up on hover instead of the old rotating gradient glow.
- **Custom cursor** (`CustomCursor.tsx`) is a bracket-cornered reticle: green by default,
  magenta on hover, amber while dragging something. Draggable elements call
  `setCursorDragging()` from `lib/cursorBus.ts` on drag start/end to trigger the amber state.
- **Real drag interactions**, not just decoration: the hero's orbiting tech badges and the
  "Meet the Developer" photos are genuinely draggable (Framer Motion `drag` +
  `dragSnapToOrigin`/`dragConstraints`) — grab and fling them, they spring back.
- **`BootScreen.tsx`** is a skippable DOS-style boot sequence shown once per browser session
  (`sessionStorage`), respecting `prefers-reduced-motion`.
- **Fonts**: "Press Start 2P" (pixel font) for headers/labels only — it's used at small
  sizes throughout (`text-[13–22px]` with `leading-relaxed`) because it's much wider per
  character than a normal display font; anything larger stops being readable. Body copy is
  JetBrains Mono everywhere, matching an actual terminal rather than a proportional UI font.
- **No blur, no soft glow, no gradients-as-decoration**: removed everywhere in favor of flat
  fills, hard 1px borders, and hover states that either invert (outline → solid fill) or
  blink (hard on/off), rather than easing/blurring.
- Tech stack logos are real brand SVGs via [simple-icons](https://simpleicons.org), forced
  monochrome phosphor-green through the CDN's own color parameter
  (`cdn.simpleicons.org/<slug>/39FF14`) rather than each tool's actual (colorful) brand color.

## Getting started

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```bash
MONGODB_URI=...
ADMIN_EMAIL=you@example.com
AUTH_SECRET=...                 # openssl rand -base64 32
```

Generate your admin password hash:

```bash
npm run hash -- "yourpassword"
# → ADMIN_PASSWORD_HASH_B64=JDJiJDEwJC4uLi4uLi4uLi4uLi4uLi4u...
```

**Paste that line exactly as printed.** A raw bcrypt hash contains `$` characters that
Next's env loader silently strips as variable references — quoted or not, this corrupts it.
Base64-encoding sidesteps the problem entirely; the app decodes it back before comparing.
**Restart `npm run dev` after editing `.env.local`.**

R2 and Brevo are optional but recommended — see the commented block in `.env.example` for
where to get each credential. Without them, file uploads and emails fail gracefully (booking
submission still works, it just won't attach a document or send a confirmation email).

Seed the database with the demo content used throughout the design phase — **this covers
every editable section on the site**, not just projects:

```bash
npm run seed
```

```bash
npm run dev
```

Visit `/` for the site, `/admin/login` for the admin dashboard, and `/account/login` for
the client dashboard (created automatically the first time someone submits `/hire`).

## What's fully implemented

### Content — everything is editable, nothing is hardcoded-only
`/admin/content` is a single tabbed page managing Experience, Services, Rate Cards, Dev
Stats, "How I Work" steps, Philosophy lines, FAQs, "Meet the Developer" photos/videos, and
Skills — nine collections through one shared `ResourceManager` table+form component, each
tab just pointing it at a different Mongoose model via `src/app/api/admin/_registry.ts`.
Projects, Testimonials, and Tech Stack have their own sidebar pages since they're higher-
traffic. Every homepage section fetches its data in `src/app/page.tsx` and falls back to
sensible defaults if a collection is empty — the site never looks broken while you're
setting content up.

### Client accounts + project dashboard
Submitting `/hire` automatically creates a `User` account (passwordless until they set one)
linked to their `Booking`, and — if Brevo is configured — emails a confirmation with a
"set up your dashboard" link; either way, that same link is also shown directly on the
success screen. From `/account/dashboard` → `/account/projects/[id]`, a client sees budget
(total/paid/outstanding, in whichever currency you set), timeline, milestones with a media
gallery, a review/rating form, and a live negotiation chat — all specific to their project.

### Negotiation built into messaging
`ThreadPanel` (`src/components/account/ThreadPanel.tsx`) is a fixed drawer pinned to the
right edge of the screen, toggleable via a floating tab, shared by both the client's project
page and your `/admin/bookings/[id]` page. You can send a plain message or attach a
structured **proposal** (budget, timeline, milestones); the client sees it as a card with
Approve/Decline buttons, and approving copies those numbers onto the `Booking` automatically.
Messages show delivered/read receipts, and the panel polls every few seconds so a message
sent on one side shows up on the other without a manual refresh.

### Admin: view-only where it should be
You can't edit what a client submitted — `/admin/messages` and `/admin/bookings` are
deliberately **not** generic create/edit tables. Messages get a dedicated list (with unread
dots) and detail page: the original message is read-only, status changes automatically to
"read" on open, and replying sends a real email via Brevo. Bookings similarly hide the
generic create/edit UI (`hideCreate`/`hideEdit` on `ResourceManager`); the client's original
submission is read-only on the detail page, and the API layer enforces this too — the
generic `PATCH /api/admin/[collection]/[id]` route strips client-submitted fields for the
`bookings` collection even if called directly, and blocks `POST` (create) for bookings
entirely, since a booking only makes sense as something a client submits.

### File uploads (Cloudflare R2) and email (Brevo)
`src/lib/r2.ts` uploads through the S3-compatible API to your R2 bucket (validates type/size,
returns a public URL); `POST /api/upload` is the shared endpoint used by the `/hire`
document-attachment field, admin milestone media, and the CV uploader in `/admin/profile`.
`src/lib/email.ts` sends via Brevo's REST API for booking confirmations, admin new-booking/
new-message notifications, and message replies — every call is best-effort and never blocks
the action it's attached to if email isn't configured.

### Notifications
`GET /api/notifications` returns unread counts for whichever session (admin or client) is
active; `useNotifications()` polls it every 8s and drives small pulsing dots — on the admin
sidebar (Messages, Bookings) and on the chat drawer's toggle tab when it's closed and there's
something new.

### Currency per project
Each `Booking` has its own `currency` field (USD, NGN, GBP, EUR, GHS, KES, ZAR, CAD — see
`src/lib/currency.ts`), settable from the admin booking detail page. Amounts are formatted
with the right symbol everywhere they're shown, so one project can be priced in dollars and
another in naira.

### Booking flow
`/hire` is a 5-step wizard with real per-field validation (inline errors, not just disabled
buttons), dropdown selects for budget range and desired timeline, a native date picker for
preferred start date (styled dark via `color-scheme` — see the dropdown note below), and a
document upload (PDF/Word/PowerPoint) via the shared R2 upload component.

### Two independent auth systems
Admin sessions (`admin_session` cookie, `lib/auth.ts`) and client sessions (`user_session`
cookie, `lib/userAuth.ts`) don't interfere with each other — you can be logged into both in
the same browser. The guarded admin pages live under the `(dashboard)` route group
(`src/app/admin/(dashboard)/`), separate from `/admin/login` — this matters, because a
nested layout *wraps inside* its parent in the App Router rather than overriding it, so the
auth-guard layout must not be an ancestor of the login page or logging in becomes an
infinite redirect loop. `User` is deliberately **excluded** from the generic admin
`REGISTRY` — that endpoint is powerful enough that exposing it would let a raw API call
overwrite a password hash outside of bcrypt.

### Native `<select>` and `<input type="date">` styling
Dark-themed sites commonly end up with unreadable white-on-white native dropdown lists,
because a `<select>`'s open option list mostly ignores CSS and falls back to the OS/browser
theme. Fixed globally in `globals.css` via `color-scheme: dark` (the actual correct fix —
tells the browser to render native form UI in its dark variant) plus explicit
background/color as a belt-and-braces fallback for browsers that need it spelled out.

### Public site
Every homepage section (Hero with an indented "socket" avatar frame and orbiting real tech
logos, marquee, About, dev stats, experience timeline, featured projects, services, "How I
Work", rate cards, testimonials with a "leave a review" link, "Meet the Developer", philosophy,
FAQ accordion, big CTA, contact form with a client-login link, footer with working social
icons), all animated with scroll reveals that re-trigger every time a section re-enters view.
Navbar's fourth link is "Client" → `/account/login` rather than a contact link (the contact
form still lives at `/contact`, linked from the footer).

## What's scaffolded but intentionally minimal

- **No real payment processing.** `totalBudget` / `amountPaid` are numbers set manually or
  via an approved proposal — no Stripe/Paystack integration actually moving money.
- **One thread per booking, not a general inbox.** The negotiation thread is scoped to a
  single project; there's no cross-project chat with a prospective client before they book.
  The public `/contact` form remains a separate, simpler channel for that.
- **Blog** — `src/models/BlogPost.ts` and its generic admin API exist (add a `blogposts` tab
  to `/admin/content` to manage it); no public `/blog` route is built yet.
- **R2 buckets are private by default.** You need to either enable public access or connect
  a custom domain to the bucket for `R2_PUBLIC_URL` to actually serve files — see the comment
  in `.env.example`.
- **3D "Tech Universe" visualization**, **cinematic preloader**, **command-palette nav**, and
  **hidden easter-egg layer** from the original spec were deliberately left out — they need
  dedicated design/engineering passes of their own. The current interaction language
  (magnetic buttons, diagonal borders, split-text, scroll reveals, the chat drawer) is
  consistent and easy to extend into those later.

## Project structure

```
src/
  app/
    (public routes)      /, /projects, /projects/[slug], /experience, /services,
                          /contact, /cv, /hire, /testimonials/new
    account/              client dashboard — login, setup, dashboard, projects/[id]
    admin/
      login/               outside the auth guard
      (dashboard)/         everything else — guarded by its own layout.tsx
    api/                  one route per concern; /api/admin/[collection] is generic
  components/
    layout/                Nav, Footer, CustomCursor, MatrixRain
    sections/               one component per homepage section, data-driven with fallbacks
    ui/                     Reveal, SplitText, Magnetic, CTAButton, DiagonalCard, SafeImage, FileUpload
    admin/                  Sidebar, ResourceManager (generic CRUD table+form)
    account/                ThreadPanel (chat drawer), ProjectReview
  lib/                    mongodb.ts, auth.ts, userAuth.ts, r2.ts, email.ts, currency.ts,
                          settings.ts, utils.ts, hooks/useNotifications.ts
  models/                 one Mongoose schema per collection
  types/                  shared TypeScript interfaces
scripts/
  seed.ts                 populates every collection with demo content
  hash-password.ts        generates ADMIN_PASSWORD_HASH_B64
```

## Notes

- Every section component accepts a data prop (`items`, `bio`, `lines`, etc.) with a
  sensible default, so it renders standalone or with real DB data interchangeably.
- Design tokens (colors, radii, keyframes) live in `tailwind.config.ts` and `globals.css` —
  the "black-panther purple" ambient system is centralized there, not scattered per-component.
- `SafeImage` falls back to a placeholder icon if a URL 404s, so a bad thumbnail link never
  shows a broken-image icon on the live site.
- Icon fields (`Service.icon`, `Stat.icon`, `WorkflowStep.icon`) store a `lucide-react`
  component name as a string (e.g. `"Smartphone"`) and are looked up at render time via
  `(Icons as any)[name]` — check [lucide.dev](https://lucide.dev/icons) for valid names.
