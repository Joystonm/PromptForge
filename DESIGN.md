# PromptForge AI — Design System

## Brand Identity
- **Name:** PromptForge AI
- **Tagline:** Turn One Idea Into a Complete Marketing Kit
- **Personality:** Intelligent, modern, magical, professional

## Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `brand-500` | `#6366f1` | Primary actions, highlights |
| `brand-600` | `#4f46e5` | Buttons, active states |
| `purple-600` | `#9333ea` | Gradient partner |
| `accent-400` | `#fb923c` | Hooks, CTAs, accents |
| `gray-950` | `#030712` | Page background |
| `gray-900` | `#111827` | Card backgrounds |
| `gray-400` | `#9ca3af` | Secondary text |
| `white/5` | `rgba(255,255,255,0.05)` | Glass surfaces |
| `white/10` | `rgba(255,255,255,0.10)` | Glass borders |

## Typography
- **Font:** Inter (Google Fonts)
- **Display:** 700–800 weight, tight leading
- **Body:** 400–500 weight, relaxed leading
- **Labels:** 600 weight, uppercase tracking-wider for section labels
- **Code/Hex:** font-mono

## Spacing
- Base unit: 4px (Tailwind default)
- Section padding: `py-20 px-6`
- Card padding: `p-6`
- Gap between cards: `gap-6`
- Gap between elements: `gap-3` or `gap-4`

## Components

### Glass Card
```
bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6
```
Hover: `hover:border-brand-500/30`

### Primary Button
```
bg-gradient-to-r from-brand-600 to-purple-600
hover:from-brand-500 hover:to-purple-500
text-white font-semibold px-6 py-3 rounded-xl
shadow-lg shadow-brand-900/50
hover:scale-[1.02] transition-all duration-200
```

### Secondary Button
```
glass text-gray-200 font-medium px-6 py-3 rounded-xl
hover:bg-white/10 hover:border-white/20
```

### Gradient Text
```
bg-gradient-to-r from-brand-400 via-purple-400 to-accent-400
bg-clip-text text-transparent
```

### Step Indicator
- Horizontal scrollable pill row
- Active: `bg-brand-600 text-white rounded-full`
- Done: `bg-brand-900/50 text-brand-400` with checkmark
- Inactive: `text-gray-600`
- Connector: `w-4 h-px bg-white/10` (done: `bg-brand-600`)

### Input / Textarea
```
bg-white/5 border border-white/10 rounded-xl px-4 py-3
text-white placeholder-gray-500
focus:outline-none focus:border-brand-500
```

### Upload Zone
```
border-2 border-dashed border-white/10 rounded-xl p-8 text-center
hover:border-brand-500/40 cursor-pointer
```

## Layout

### Page Background
```
bg-gray-950
background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.15), transparent)
```

### Navigation
- Fixed top, `glass` surface, `h-16`, `border-b border-white/5`
- Logo: 32×32 gradient icon + bold text
- Right: CTA button

### Campaign Workflow
- Centered content, `max-w-2xl` for single-column steps
- `max-w-3xl` for selection grids
- `max-w-6xl` for review/export
- `animate-slide-up` on each step mount

## Animations
| Name | Definition |
|------|-----------|
| `fade-in` | opacity 0→1, 0.5s ease-in-out |
| `slide-up` | opacity 0→1 + translateY 16px→0, 0.4s ease-out |
| `shimmer` | background-position sweep, 2s linear infinite |
| `animate-pulse` | Tailwind built-in, for loading states |
| `animate-spin` | Tailwind built-in, for spinners |

## Iconography
- Library: **Lucide React**
- Size: `w-4 h-4` inline, `w-5 h-5` buttons, `w-8 h-8` hero icons
- Color: inherit from parent or explicit `text-brand-400`

## Responsive Breakpoints
- Mobile: single column, full-width buttons
- `sm` (640px): 2-column grids
- `lg` (1024px): 3-column review layout, side-by-side panels

## Accessibility
- All interactive elements have focus states (`focus:outline-none focus:border-brand-500`)
- Color contrast: text on dark backgrounds meets WCAG AA
- Loading states communicated via `aria-busy` and visible spinners
- Images have `alt` attributes

## Page Structure

### Landing (`/`)
1. Fixed nav
2. Hero section — headline, subtext, dual CTAs
3. Features grid (4 cards)
4. How It Works (6 steps)
5. CTA banner
6. Footer

### Campaign Workflow (`/campaign`)
1. Sticky header with step indicator
2. Step content area (centered, animated)
3. Error banner (conditional)

### Workflow Steps
1. **Idea** — textarea + example pills
2. **Platforms** — 8-platform icon grid
3. **Asset Types** — 9-type icon grid
4. **Formats** — dimension cards with aspect ratio preview
5. **Brief** — AI-generated cards + color swatches + taglines
6. **Upload** — drag-drop zone + uploaded asset grid with AI analysis
7. **Generate** — stage progress with animated indicators
8. **Review** — asset list sidebar + preview panel + scores + download
