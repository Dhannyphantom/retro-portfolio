# Daniel Olojo — Portfolio (Next.js + MongoDB)

A full-stack developer portfolio: cinematic dark/purple design system, MongoDB-backed
content, an admin dashboard for managing everything without touching code, a working
contact form, and a multi-step project-booking flow.

Every public page degrades gracefully with built-in demo content if the database isn't
configured yet — clone it, `npm install`, `npm run dev`, and it looks complete immediately.
Connect MongoDB and seed it whenever you're ready to make it real.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for scroll reveals / entrance animation
- **MongoDB + Mongoose** for content
- **jose** (JWT) + **bcryptjs** for a lightweight admin auth system (no external auth provider needed)
- **Zod** for API input validation

## Getting started

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```bash
MONGODB_URI=...                 # MongoDB Atlas connection string (or local mongod)
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD_HASH=...         # node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
AUTH_SECRET=...                 # openssl rand -base64 32
```

Then seed the database with the demo content used throughout the design phase (projects,
experience, services, rate cards, testimonials, FAQs):

```bash
npm run seed
```

Run the dev server:

```bash
npm run dev
```

Visit `/` for the site and `/admin/login` for the dashboard.

## What's fully implemented

- **Public site** — every homepage section (Hero, marquee, About, dev stats, experience
  timeline, featured projects, services, "How I work", rate cards, testimonials, "Meet the
  Developer" with photo/video cards, philosophy, FAQ accordion, big CTA, contact form,
  footer), all animated (scroll reveals that re-trigger, magnetic buttons, diagonal rotating
  borders, custom cursor, code-typing background, split-text headline).
- **Standalone routes**: `/projects` (filterable archive), `/projects/[slug]` (case study
  with prev/next navigation), `/experience`, `/services`, `/contact`, `/cv`, `/hire`
  (5-step project brief wizard that posts to the database and returns a reference ID).
- **API**: `/api/contact`, `/api/bookings`, `/api/projects`, `/api/projects/[slug]`,
  `/api/testimonials` (all public), plus `/api/auth/login` and `/api/auth/logout`.
- **Admin auth** — single-admin JWT session in an httpOnly cookie, checked in
  `src/app/admin/layout.tsx`. No database user table required (credentials live in env
  vars) — swap in `src/models/AdminUser.ts` if you'd rather manage multiple admins in Mongo.
- **Generic admin CRUD** — `/api/admin/[collection]` and `/api/admin/[collection]/[id]`
  read the collection name from the URL and look it up in `src/app/api/admin/_registry.ts`,
  so every collection (projects, experience, services, rate cards, testimonials, FAQs,
  messages, bookings, skills, blog posts) is manageable through **one** pair of route files
  instead of one per collection.
- **Admin dashboard UI** — `/admin` (overview with counts), `/admin/projects`,
  `/admin/testimonials`, `/admin/messages`, `/admin/bookings` all use the shared
  `ResourceManager` component (table + modal form) wired to the generic API above.
  `/admin/settings` is a dedicated form for the site-wide singleton document (name, bio,
  socials, CV link, availability).

## What's scaffolded but intentionally minimal

These follow the exact same pattern as what's built — copy an existing admin page and
swap the `collection` + `fields` props:

- Admin screens for **Experience**, **Services**, **Rate Cards**, **FAQs**, and **Skills**
  aren't wired up as dashboard pages yet, but their models and generic API endpoints
  already exist (`/api/admin/experience`, `/api/admin/services`, etc.). Add a page like
  `src/app/admin/projects/page.tsx` pointing `ResourceManager` at the right collection and
  field list, and it works immediately.
- **Media library** — `src/models/Media.ts` exists; there's no upload UI. Wire it to
  whatever storage you use (Cloudinary, S3, Vercel Blob) and store the resulting URL —
  every image field in this project is just a URL string.
- **Blog** — `src/models/BlogPost.ts` and the generic admin API exist; no public `/blog`
  route is built yet.
- **CV upload** — `/admin/settings` takes a CV URL (upload the file wherever you host
  media and paste the link); there's no in-app file upload widget.
- **3D "Tech Universe" visualization**, **cinematic preloader**, **command-palette nav**,
  and **hidden easter-egg layer** from the original spec were deliberately left out — they
  need dedicated design/engineering passes of their own and would have diluted everything
  else. The current interaction language (magnetic buttons, diagonal borders, split-text,
  scroll reveals) is consistent and easy to extend into those if you want them later.

## Project structure

```
src/
  app/                  routes (App Router) — public pages, /admin/*, /api/*
  components/
    layout/              Nav, Footer, CustomCursor, CodeTypingBG, AmbientBackground
    sections/             one component per homepage section, reused across standalone routes
    ui/                   Reveal, SplitText, Magnetic, CTAButton, DiagonalCard, SafeImage
    admin/                Sidebar, ResourceManager (generic CRUD table+form)
  lib/                   mongodb.ts (cached connection), auth.ts (JWT session), utils.ts
  models/                one Mongoose schema per collection
  types/                 shared TypeScript interfaces
scripts/
  seed.ts                populates the DB with the demo content
```

## Notes

- Every section component accepts an `items`/`bio`/etc. prop with a sensible default, so
  you can render them standalone (as the `/experience` and `/services` routes do) or feed
  them real data from a DB query (as the homepage does).
- The design tokens (colors, radii, keyframes) live in `tailwind.config.ts` and
  `globals.css` — the whole "black-panther purple" ambient-glow system is centralized
  there, not scattered per-component.
- `SafeImage` silently falls back to a placeholder icon if an image URL 404s, so a bad
  thumbnail link never shows a broken-image icon on the live site.
