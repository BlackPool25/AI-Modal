# 🎬 Advanced Scroll Transitions - DetectX

## Overview
DetectX features a cinematic, scroll-triggered transition system inspired by the most modern and well-animated websites. Each section reveals itself with a unique transition effect as you scroll.

## Transition Types

### 1. **Split Transition** (`split`)
- The screen splits from the center
- Left and right curtains peel away
- Content scales up and fades in
- **Used for**: Hero Section, Stats Section

### 2. **Wipe Left** (`wipe-left`)
- Content slides in from right to left
- Creates a horizontal reveal effect
- Smooth opacity transition
- **Used for**: How It Works Section

### 3. **Wipe Right** (`wipe-right`)
- Content slides in from left to right
- Opposite direction of wipe-left
- **Used for**: Quote Section

### 4. **Slide Up** (`slide-up`)
- Content slides up from bottom
- Classic reveal with vertical motion
- **Used for**: CTA Section

### 5. **Fade** (`fade`)
- Simple fade in with subtle upward motion
- Most subtle transition option
- **Available but not currently used**

## Homepage Scroll Flow

```
1. Hero Section          → Split Transition (Center Reveal)
                           ↓
2. How It Works         → Wipe Left (Right to Left)
                           ↓
3. Quote Section        → Wipe Right (Left to Right)
                           ↓
4. Stats Section        → Split Transition (Center Reveal)
                           ↓
5. CTA Section          → Slide Up (Bottom to Top)
```

## Technical Implementation

### GSAP ScrollTrigger
- All transitions use GSAP ScrollTrigger for smooth scroll-based animations
- `scrub: 1` creates smooth scrubbing effect tied to scroll position
- Triggers activate at `top 80%` (when section enters viewport)
- Completes at `top 20%` for full reveal

### Performance
- Hardware-accelerated CSS transforms
- Smooth 60fps animations
- Optimized scroll listeners
- Minimal repaints and reflows

### Key Features
- **Continuous scroll**: No snapping, natural scroll flow
- **Responsive**: Works on all screen sizes
- **Smooth scrubbing**: Transitions tied to scroll progress
- **Alternating effects**: Each section has different transition for visual variety

## Usage

```tsx
import { ScrollSection } from '@/components/scroll/ScrollSection'

<ScrollSection transitionType="split">
  <YourContent />
</ScrollSection>
```

## Customization

Edit `/components/scroll/ScrollSection.tsx` to:
- Adjust transition timing (change `duration`)
- Modify trigger points (change `start` and `end`)
- Add new transition types
- Customize animation easing

## Inspiration Sources
- GSAP ScrollTrigger demos
- Award-winning creative studio websites
- Modern product landing pages with cinematic scrolling
- Apple-style smooth transitions

## Browser Support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires JavaScript enabled
- Gracefully degrades on older browsers

---

**Created**: 2025
**Tech Stack**: Next.js 14+, GSAP, ScrollTrigger, Framer Motion


