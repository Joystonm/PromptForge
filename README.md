# PromptForge AI

AI-powered marketing campaign generation platform. Transform a simple natural-language idea into a complete, brand-consistent marketing kit.

## Stack

- **Next.js 15** (App Router)
- **MiniMax-M2.7** — campaign strategy, copy, image analysis
- **MiniMax image-01** — AI visual generation
- **Cloudinary** — media transformation, optimization, CDN delivery
- **Supabase** — auth & database
- **Tailwind CSS** — styling
- **Zustand** — client state

## Setup

1. Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | [Cloudinary Console](https://console.cloudinary.com) |
| `CLOUDINARY_API_KEY` | Cloudinary Console → Settings → API Keys |
| `CLOUDINARY_API_SECRET` | Cloudinary Console → Settings → API Keys |
| `MINIMAX_API_KEY` | [MiniMax Platform](https://api.minimax.io) |
| `NEXT_PUBLIC_SUPABASE_URL` | [Supabase Dashboard](https://supabase.com/dashboard) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API |

2. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Workflow

1. **Campaign Idea** — describe your campaign in plain English
2. **AI Analysis** — MiniMax-M2.7 extracts brand tone, audience, objectives
3. **Platform Selection** — Instagram, LinkedIn, YouTube, Facebook, X, Website, Email, Google Display
4. **Asset Types** — social posts, stories, banners, thumbnails, carousels, etc.
5. **Format Selection** — exact pixel dimensions per platform
6. **Creative Brief** — AI-generated strategy, color palette, taglines, hooks
7. **Brand Asset Upload** — logos and product images analyzed by MiniMax vision
8. **Generation** — MiniMax image-01 creates visuals → uploaded to Cloudinary → copy generated per format
9. **Review & Export** — preview in mockups, download individual assets or full kit

## Design

All UI follows `DESIGN.md` — the single source of truth for layouts, colors, typography, spacing, and interactions.

## Deployment

Deploy to Vercel:

```bash
npx vercel --prod
```

Add all `.env.local` variables to your Vercel project environment settings.
