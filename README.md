# PromptForge AI

> **April Mini-Hack: Build for a More Mindful Digital Future**

AI-powered marketing campaign generation platform. Describe a campaign idea in plain English and get a complete, brand-consistent marketing kit every asset optimized for sustainable delivery by Cloudinary.

**Core thesis: create once, optimize everywhere, deliver sustainably.**  
One AI-generated image powers every platform format through Cloudinary URL transforms. No redundant files, no wasted storage, no unnecessary compute.

---

## Stack

- **Next.js 15** (App Router)
- **MiniMax-M2.7** — campaign strategy, copy, image analysis
- **MiniMax image-01** — AI visual generation
- **Cloudinary** — media transformation, optimization, CDN delivery
- **Tailwind CSS** — styling
- **Zustand** — client state

---

## How Cloudinary Powers the Platform

Cloudinary is not just a CDN here , it is the entire media engine. Every sustainability feature in the app is built on top of Cloudinary's transformation pipeline.

### Single Source, Infinite Formats

After MiniMax generates one image, it is uploaded to Cloudinary **once**. Every platform format — Instagram post, YouTube thumbnail, Google leaderboard, email header — is derived purely through URL parameters. No re-generation, no re-upload, no extra storage.

```
# Same public ID, different transforms = different formats
/image/upload/w_1080,h_1080,c_fill,g_auto,f_auto,q_auto,dpr_auto/{publicId}  → Instagram Post
/image/upload/w_1280,h_720,c_fill,g_auto,f_auto,q_auto,dpr_auto/{publicId}   → YouTube Thumbnail
/image/upload/w_728,h_90,c_fill,g_auto,f_auto,q_auto,dpr_auto/{publicId}     → Google Leaderboard
```

### Transformations Active on Every Asset

| Transform | Effect |
|---|---|
| `f_auto` | Serves WebP/AVIF to modern browsers, JPEG as fallback — ~30% smaller than PNG |
| `q_auto` | Perceptual quality algorithm — smallest file at visually acceptable quality |
| `c_fill` + `g_auto` | AI smart crop — keeps the subject in frame at any aspect ratio |
| `dpr_auto` | Serves 1× to 1× screens, 2× to retina — no over-serving |
| `fl_progressive` | Progressive JPEG — images render top-down instantly |

### Cloudinary Studio (Live Transform Playground)

The Review step includes an interactive Studio tab with real-time previews:

- **Text Overlays** — `l_text` + `e_gradient_fade` burns headline and CTA directly into the image
- **Generative Fill** — `c_pad,b_gen_fill` extends the canvas to any aspect ratio with AI-generated background
- **Artistic Filters** — 15 `e_art:*` styles (hokusai, peacock, daguerre, etc.)
- **AI Enhancement** — `e_improve`, `e_sharpen`, `e_auto_color`, `e_vibrance`, `e_upscale`, `e_noise`
- **Smart Gravity Crop** — reframe with `g_face`, `g_faces`, `g_north_east`, and more
- **Background Removal** — `e_background_removal` isolates the subject with optional color fill

### Responsive srcset

The asset gallery generates native `<img srcset>` with three Cloudinary breakpoints (480w, 768w, 1280w). The browser fetches only the size it needs — no wasted bytes on mobile.

### Optimization Comparison Slider

A before/after drag slider compares the raw original URL vs. Cloudinary-optimized WebP delivery with live file size estimates.

---

## Sustainability

Sustainability is measured and actionable — not just a badge.

### Green Score (0–100)

Every campaign gets a score based on five factors:

| Factor | Max | How |
|---|---|---|
| Compression Efficiency | 40 | `f_auto` + `q_auto` achieve ~82% size reduction |
| Asset Reuse Rate | 30 | Formats generated vs. unique source uploads |
| Format Optimization | 20 | WebP/AVIF via `f_auto` (always active) |
| CDN Delivery | 5 | Global CDN (always active) |
| DPR-Aware Delivery | 5 | `dpr_auto` prevents over-serving retina images |

### Green Impact Dashboard

The **Green Impact** tab in the Review step shows:

- Bandwidth saved (MB) and % reduction vs. unoptimized delivery
- CO₂ avoided per campaign delivery cycle
- Load time saved on 3G
- Asset reuse ratio (N formats from 1 source file)
- DPR savings from not over-serving retina images
- Trees equivalent for CO₂ savings
- Before/after storage footprint bar
- Per-asset delivery breakdown with thumbnails

### Carbon Budget Tracker

Set a CO₂ target in grams. A progress bar tracks actual emissions against the budget and flags when you're over with a specific fix.

### Eco-Copy Tips

The Creative Brief step surfaces tips that reduce data weight at the copy level — shorter headlines, single CTAs, Cloudinary text overlays instead of embedded fonts, tagline reuse across platforms via URL transforms.

### Sustainability Report Export

Download a timestamped JSON report of all metrics, recommendations, and active Cloudinary optimizations from the Green Impact dashboard.

---

## Workflow

1. **Campaign Idea** — describe in plain English
2. **AI Analysis** — MiniMax-M2.7 extracts brand, audience, tone, objectives
3. **Platform Selection** — Instagram, LinkedIn, YouTube, Facebook, X, Website, Email, Google Display
4. **Asset Types** — social posts, stories, banners, thumbnails, carousels, email headers
5. **Format Selection** — 12 presets with exact pixel dimensions
6. **Creative Brief** — AI-generated strategy, palette, taglines, hooks + eco-copy tips
7. **Brand Asset Upload** — logos/product images analyzed by MiniMax vision
8. **Generation** — MiniMax image-01 creates visual → uploaded to Cloudinary → copy generated per format
9. **Review & Export** — Platform Gallery, Optimization Slider, Cloudinary Studio, Green Impact Dashboard

---

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | [Cloudinary Console](https://console.cloudinary.com) |
| `CLOUDINARY_API_KEY` | Cloudinary Console → Settings → API Keys |
| `CLOUDINARY_API_SECRET` | Cloudinary Console → Settings → API Keys |
| `MINIMAX_API_KEY` | [MiniMax Platform](https://api.minimax.io) |

---

## Deployment

```bash
npx vercel --prod
```

Add all `.env.local` variables to your Vercel project → Settings → Environment Variables. **Env var changes require a redeploy to take effect.**
