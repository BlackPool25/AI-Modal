# 📂 DetectX - Project Structure

Last updated: 2024

---

## 🗂️ Root Directory

```
detectx/
├── app/                     # Next.js 14 App Router pages
├── components/              # React components
├── lib/                     # Utilities and helpers
├── public/                  # Static assets
├── docs/                    # 📚 All documentation
├── .gitignore              # Git ignore rules
├── .node-version           # Node.js version (18)
├── .npmrc                  # NPM configuration
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel deployment config
├── README.md               # Main project README
└── PROJECT_STRUCTURE.md    # ← This file
```

---

## 📱 App Directory (`/app`)

Next.js 14 App Router with all pages:

```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Homepage
├── globals.css             # Global styles
├── about/
│   └── page.tsx           # About page
├── awareness/
│   └── page.tsx           # Timeline & awareness page
├── contact/
│   └── page.tsx           # Contact page
├── datasets/
│   └── page.tsx           # Datasets page (dynamic JSON)
├── how-it-works/
│   └── page.tsx           # Detection pipeline page
├── research/
│   └── page.tsx           # Research papers page (dynamic JSON)
└── resources/
    └── page.tsx           # Resources page
```

**Total Pages**: 11 (all static pre-rendered)

---

## 🧩 Components (`/components`)

Organized by function:

```
components/
├── animations/             # Animation components
│   ├── PageLoader.tsx     # Page loading animation
│   └── TiltText.tsx       # 3D tilt effect
├── data/                   # Data display components
│   ├── DatasetCard.tsx    # Dataset card with tiling animation
│   └── PaperCard.tsx      # Research paper card
├── effects/                # Global effects
│   ├── BackgroundAnimation.tsx  # Particle background
│   ├── SmoothScroll.tsx        # Lenis smooth scrolling
│   └── ScrollToTop.tsx         # Navigation scroll reset
├── home/                   # Homepage sections
│   ├── Hero.tsx           # Hero section with 3D title
│   ├── HowItWorks.tsx     # Detection cards & pipeline
│   ├── ModeTiles.tsx      # Mode selection tiles
│   └── StatsSection.tsx   # Statistics display
├── layout/                 # Layout components
│   ├── Navbar.tsx         # Navigation bar
│   └── Footer.tsx         # Footer
├── providers/              # React Context providers
│   └── ThemeProvider.tsx  # Theme & mode management
├── scroll/                 # Scroll components
│   └── ScrollSection.tsx  # Scroll transitions (split, wipe, slide)
└── ui/                     # Reusable UI components
    ├── Button.tsx         # Button component
    └── Card.tsx           # Card component
```

---

## 🛠️ Library (`/lib`)

Utilities and configuration:

```
lib/
├── animationVariants.ts   # Framer Motion animation variants
└── utils.ts               # Utility functions (cn, modes, etc.)
```

---

## 🖼️ Public Assets (`/public`)

Static files served directly:

```
public/
├── data/                   # JSON data files
│   ├── datasets/
│   │   └── datasets.json  # Dataset listings (6 samples)
│   ├── papers/
│   │   └── papers.json    # Research papers (6 samples)
│   └── README.txt         # Data folder instructions
├── logo.png                # Light mode logo (optional)
└── logo-dark.png           # Dark mode logo (optional)
```

**Note**: Logo files are optional. Website shows "DetectX" text if logos are missing.

---

## 📚 Documentation (`/docs`)

All project documentation:

```
docs/
├── README.md                    # Documentation index
├── QUICK_DEPLOY.md             # Quick deployment (3 steps)
├── VERCEL_DEPLOYMENT.md        # Complete deployment guide
├── FIX_AND_DEPLOY.md           # Troubleshooting & fixes
├── SCROLL_FIX.md               # Navigation scroll fix
├── PIPELINE_REDESIGN.md        # Design documentation
├── SCROLL_TRANSITIONS.md       # Animation specifications
├── DATA_FEATURES.md            # Data system overview
├── DATA_INSTRUCTIONS.md        # How to add data
├── LOGO_SETUP.md               # Logo upload guide
├── DARK_MODE_LOGO.md           # Dark mode logo setup
├── LOGO_INSTRUCTIONS.txt       # Quick logo reference
├── DEPLOYMENT_STATUS.txt       # Current deployment status
└── QUICKSTART.md               # Quick start guide
```

---

## ⚙️ Configuration Files

### TypeScript
- `tsconfig.json` - TypeScript compiler options
- Uses strict mode, path aliases (`@/*`)

### Tailwind
- `tailwind.config.ts` - Theme, colors, animations
- Custom animations: float, slot-spin, gradient, etc.
- Color modes: text, image, video

### Next.js
- `next.config.js` - Next.js configuration
- Image optimization enabled
- React strict mode enabled

### PostCSS
- `postcss.config.js` - TailwindCSS & Autoprefixer

### Vercel
- `vercel.json` - Deployment configuration
- Framework: Next.js
- Region: US East (iad1)

### NPM
- `package.json` - Dependencies (React 18.2.0)
- `.npmrc` - NPM settings
- `.node-version` - Node.js 18 requirement

---

## 🎨 Styling Architecture

### Global Styles
- `/app/globals.css` - Base styles, CSS custom properties
- Tailwind directives (@tailwind, @layer)
- Theme-specific CSS variables

### Component Styles
- Inline Tailwind classes
- Glass morphism utilities
- Dynamic style props for colors

### Theming
- Dark/Light mode via next-themes
- Detection mode colors (Text, Image, Video)
- CSS custom properties for dynamic theming

---

## 🔧 Key Technologies

### Core
- Next.js 14.2.33 (App Router)
- React 18.2.0
- TypeScript 5.3.3
- TailwindCSS 3.4.18

### Animations
- Framer Motion 11.0.3
- GSAP 3.12.5
- Lenis 1.0.42
- React Spring 9.7.3

### UI
- shadcn/ui components
- Lucide React icons
- next-themes for theming

---

## 📊 Build Output

### Static Pages (11 total)
```
Route (app)                    Size      First Load JS
┌ ○ /                         56 kB      186 kB
├ ○ /about                    3.43 kB    133 kB
├ ○ /awareness                3.82 kB    134 kB
├ ○ /contact                  3.59 kB    134 kB
├ ○ /datasets                 3.52 kB    134 kB
├ ○ /how-it-works            3.42 kB    127 kB
├ ○ /research                 3.7 kB     134 kB
└ ○ /resources                3.95 kB    134 kB

Shared chunks: 87.3 kB
```

### Performance
- All pages pre-rendered (○ Static)
- Optimized bundle sizes
- Code splitting enabled
- Image optimization ready

---

## 🚀 Deployment Structure

### Vercel Build Process
1. Install dependencies (`npm install`)
2. Type checking (`tsc`)
3. Build Next.js (`npm run build`)
4. Generate static pages (11/11)
5. Upload to CDN
6. Deploy globally

### Output
- Static HTML/CSS/JS
- Pre-rendered pages
- Optimized assets
- CDN distribution

---

## 📁 File Naming Conventions

### Components
- PascalCase: `HeroSection.tsx`
- Matches export name

### Pages
- kebab-case folders: `how-it-works/`
- `page.tsx` for route files

### Utilities
- camelCase: `animationVariants.ts`

### Documentation
- UPPERCASE: `README.md`
- Descriptive names: `QUICK_DEPLOY.md`

---

## 🔄 Data Flow

### Static Data
```
JSON files → Public folder → Fetch in page → Display in components
```

### Theme Data
```
User selection → Context → CSS variables → Component styles
```

### Navigation
```
Link click → Next.js router → ScrollToTop → Page render
```

---

## 🎯 Important Paths

### For Users
- `/docs/QUICK_DEPLOY.md` - Start here
- `/docs/DATA_INSTRUCTIONS.md` - Add data
- `/public/data/` - Edit JSON files

### For Developers
- `/components/` - Add components
- `/app/` - Add pages
- `/lib/` - Add utilities
- `/tailwind.config.ts` - Customize theme

---

## 📦 What Gets Deployed

### Included
✅ All `/app` pages
✅ All `/components`
✅ All `/lib` utilities
✅ All `/public` assets
✅ All config files
✅ package.json & package-lock.json

### Excluded (via .gitignore)
❌ `/node_modules`
❌ `/.next`
❌ `/.vercel`
❌ `.env` files
❌ IDE config files
❌ Build artifacts

---

## 🔍 Finding Files

### Need to...
**Add a page?** → `/app/new-page/page.tsx`
**Add a component?** → `/components/category/Component.tsx`
**Update data?** → `/public/data/datasets|papers/*.json`
**Read docs?** → `/docs/README.md`
**Configure build?** → `next.config.js` or `vercel.json`
**Change theme?** → `tailwind.config.ts`

---

## ✨ Clean & Organized

All documentation moved to `/docs/`
All data files in `/public/data/`
All components categorized
No clutter in root directory

**Ready for development and deployment! 🚀**

