# 🚀 DetectX - AI Content Detection Platform

A modern, cinematic web application for detecting AI-generated text, images, and videos. Built with Next.js 14, React 18, TypeScript, and featuring stunning animations powered by Framer Motion, GSAP, and Lenis.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)

---

## ✨ Features

### 🎨 **Modern Design**
- Glassmorphism UI with backdrop blur effects
- Dark/Light theme support with next-themes
- Color-coded detection modes (Text, Image, Video)
- Smooth scroll animations with Lenis
- Apple-inspired aesthetics

### 🎬 **Advanced Animations**
- Page load animations with logo wipe effect
- Scroll-triggered transitions (split, wipe, slide)
- 3D tilt effects on interactive elements
- Vertical slot machine navigation hover effects
- Pulsing halos and gradient animations
- GSAP-powered timeline animations

### 📊 **Dynamic Content**
- JSON-based datasets and research papers
- Tiling card animations on load
- Staggered reveal effects
- Real-time data loading with loading states

### 🔧 **Detection Pipeline**
- Vertical flowing timeline layout
- Color-coded steps with pulsing icons
- Detailed feature breakdown
- Interactive hover states

### 📱 **Fully Responsive**
- Mobile-first design
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized animations for mobile

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/detectx.git
cd detectx

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
detectx/
├── app/                      # Next.js 14 app directory
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Homepage with scroll sections
│   ├── about/               # About page
│   ├── awareness/           # Timeline page
│   ├── datasets/            # Dynamic datasets page
│   ├── research/            # Research papers page
│   ├── how-it-works/        # Detection pipeline page
│   ├── resources/           # Resources page
│   └── contact/             # Contact page
├── components/
│   ├── animations/          # Reusable animations
│   │   ├── PageLoader.tsx   # Page loading animation
│   │   └── TiltText.tsx     # 3D tilt effect
│   ├── data/                # Data display components
│   │   ├── DatasetCard.tsx  # Dataset card with animations
│   │   └── PaperCard.tsx    # Research paper card
│   ├── effects/             # Global effects
│   │   ├── BackgroundAnimation.tsx  # Particle effects
│   │   ├── SmoothScroll.tsx         # Lenis smooth scroll
│   │   └── ScrollToTop.tsx          # Navigation scroll fix
│   ├── home/                # Homepage sections
│   │   ├── Hero.tsx         # Hero section
│   │   ├── HowItWorks.tsx   # Detection cards
│   │   ├── ModeTiles.tsx    # Mode selection tiles
│   │   └── StatsSection.tsx # Statistics display
│   ├── layout/              # Layout components
│   │   ├── Navbar.tsx       # Navigation bar
│   │   └── Footer.tsx       # Footer
│   ├── providers/           # Context providers
│   │   └── ThemeProvider.tsx # Theme & mode management
│   ├── scroll/              # Scroll components
│   │   └── ScrollSection.tsx # Scroll transitions
│   └── ui/                  # Reusable UI components
│       ├── Button.tsx
│       └── Card.tsx
├── lib/                     # Utilities and helpers
│   ├── animationVariants.ts # Framer Motion variants
│   └── utils.ts             # Utility functions
├── public/
│   ├── data/                # JSON data files
│   │   ├── datasets/
│   │   │   └── datasets.json
│   │   └── papers/
│   │       └── papers.json
│   ├── logo.png             # Light mode logo
│   └── logo-dark.png        # Dark mode logo
├── docs/                    # 📚 Documentation
│   ├── README.md            # Docs index
│   ├── QUICK_DEPLOY.md      # Quick deployment
│   ├── VERCEL_DEPLOYMENT.md # Full deployment guide
│   └── ...                  # More guides
└── README.md                # ← You are here
```

---

## 🎨 Tech Stack

### Core
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS

### Animations
- **[Framer Motion](https://www.framer.com/motion/)** - React animation library
- **[GSAP](https://greensock.com/gsap/)** - Professional animations
- **[Lenis](https://lenis.studiofreight.com/)** - Smooth scroll
- **[React Spring](https://www.react-spring.dev/)** - Physics-based animations

### UI Components
- **[shadcn/ui](https://ui.shadcn.com/)** - Reusable components
- **[Lucide React](https://lucide.dev/)** - Icon system
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

---

## 📚 Documentation

All documentation is in the `/docs` folder:

- **[Quick Deploy Guide](./docs/QUICK_DEPLOY.md)** - Deploy in 3 steps
- **[Vercel Deployment](./docs/VERCEL_DEPLOYMENT.md)** - Complete deployment guide
- **[Data Instructions](./docs/DATA_INSTRUCTIONS.md)** - Add datasets/papers
- **[Logo Setup](./docs/LOGO_SETUP.md)** - Upload custom logos
- **[Scroll Fix](./docs/SCROLL_FIX.md)** - Navigation scroll solution
- **[Pipeline Redesign](./docs/PIPELINE_REDESIGN.md)** - Design documentation

[📖 View all documentation →](./docs/README.md)

---

## 🎯 Key Features Breakdown

### Homepage Scroll Transitions
- **Split Transition**: Screen splits from center
- **Wipe Left/Right**: Horizontal reveal effects
- **Slide Up**: Vertical entrance animations

### Detection Modes
Three color-coded modes with unique themes:
- **Text Detection** - Blue theme (#38BDF8)
- **Image Detection** - Pink theme (#F472B6)
- **Video Detection** - Orange theme (#FB923C)

### Dynamic Data Loading
- Datasets loaded from `/public/data/datasets/datasets.json`
- Research papers from `/public/data/papers/papers.json`
- Automatic loading states and error handling

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

**[Full deployment guide →](./docs/QUICK_DEPLOY.md)**

### Environment Variables
No environment variables required for basic deployment.

---

## 🎨 Customization

### Add Your Logo
1. Add `logo.png` to `/public/` (512x512px recommended)
2. Optionally add `logo-dark.png` for dark mode

[Logo setup guide →](./docs/LOGO_SETUP.md)

### Add Datasets
Edit `/public/data/datasets/datasets.json`:
```json
{
  "id": "unique-id",
  "title": "Dataset Name",
  "description": "Description",
  "url": "https://link.com",
  "category": "Image",
  "size": "2 GB",
  "year": "2024",
  "downloads": "1K+"
}
```

[Data instructions →](./docs/DATA_INSTRUCTIONS.md)

### Change Theme Colors
Edit `tailwind.config.ts`:
```ts
colors: {
  text: { DEFAULT: '#38BDF8' },    // Text mode color
  image: { DEFAULT: '#F472B6' },   // Image mode color
  video: { DEFAULT: '#FB923C' },   // Video mode color
}
```

---

## 📊 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Build Size**: ~87 KB shared chunks
- **Static Pages**: All 11 pages pre-rendered
- **First Load**: < 200 KB per page
- **Animations**: 60 FPS hardware-accelerated

---

## 🔧 Development

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

### Code Structure
- All pages are in `/app` using Next.js App Router
- Components are in `/components` organized by function
- Animations use Framer Motion and GSAP
- Styling with TailwindCSS and CSS custom properties

---

## 🐛 Troubleshooting

### Build Errors
See [FIX_AND_DEPLOY.md](./docs/FIX_AND_DEPLOY.md)

### Scroll Issues
See [SCROLL_FIX.md](./docs/SCROLL_FIX.md)

### Deployment Issues
See [VERCEL_DEPLOYMENT.md](./docs/VERCEL_DEPLOYMENT.md)

---

## 📝 License

ISC License - feel free to use this project for your own purposes.

---

## 🙏 Acknowledgments

- Design inspired by Apple's aesthetic
- Animation techniques from Awwwards winners
- Built with amazing open-source tools

---

## 📞 Support

- **Documentation**: [/docs](./docs/)
- **Issues**: GitHub Issues
- **Deployment**: [Vercel Docs](https://vercel.com/docs)

---

## 🎯 Roadmap

- [ ] Add actual AI detection functionality
- [ ] Implement user authentication
- [ ] Add API endpoints for detection
- [ ] Create admin dashboard
- [ ] Add more datasets and papers

---

**Made with ❤️ and lots of animations**

**[📚 Read the docs](./docs/README.md)** | **[🚀 Deploy now](./docs/QUICK_DEPLOY.md)** | **[⭐ Star on GitHub](https://github.com)**

