# 🎨 Logo Setup Guide for DetectX

## Where to Place Your Logo

Place your logo file in the **`public`** folder at the root of your project:

```
AI-Website/
├── public/
│   └── logo.png          ← Place your logo here
├── app/
├── components/
└── ...
```

## Logo File Requirements

### Recommended Specifications:
- **Format**: PNG (with transparent background preferred)
- **Size**: 512x512px or 1024x1024px (square format)
- **File name**: `logo.png`
- **Background**: Transparent (so it looks good on the gradient background)

### Alternative Formats (also supported):
- `logo.svg` - Vector format (best for scaling)
- `logo.jpg` - If you prefer JPEG
- `logo.webp` - Modern web format

## How to Upload Your Logo

### Option 1: Using File Manager
1. Open your file manager
2. Navigate to `/home/lightdesk/Projects/AI-Website/public/`
3. Copy your logo file into this folder
4. Rename it to `logo.png`

### Option 2: Using Terminal
```bash
# Copy your logo to the public folder
cp /path/to/your/logo.png /home/lightdesk/Projects/AI-Website/public/logo.png
```

### Option 3: Drag and Drop
1. Open VS Code or your editor
2. Drag your logo file into the `public` folder in the file tree
3. Rename it to `logo.png`

## If Using a Different File Name

If you want to use a different name (e.g., `detectx-logo.png`), update this file:

**`components/animations/PageLoader.tsx`** (Line 48):
```tsx
<Image
  src="/detectx-logo.png"  // Change this
  alt="DetectX Logo"
  fill
  className="object-contain"
/>
```

## Logo Usage Across the Site

Your logo is currently used in:

1. **Loading Animation** - Shows during page transitions
2. **Navbar** - Text-based "DetectX" (you can replace with logo)
3. **Footer** - Text-based "DetectX" (you can replace with logo)

## Optional: Add Logo to Navbar

To replace the text "DetectX" with your logo in the navbar:

**Edit `components/layout/Navbar.tsx`** (around line 56):

```tsx
{/* Logo */}
<Link href="/" className="flex items-center space-x-2 group">
  <Image
    src="/logo.png"
    alt="DetectX"
    width={40}
    height={40}
    className="object-contain"
  />
  <span className="text-xl font-bold">DetectX</span>
</Link>
```

## Optional: Add Logo to Footer

**Edit `components/layout/Footer.tsx`** (around line 35):

```tsx
<div className="flex items-center space-x-3">
  <Image
    src="/logo.png"
    alt="DetectX"
    width={48}
    height={48}
    className="object-contain"
  />
  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
    DetectX
  </h3>
</div>
```

## Fallback Behavior

If no logo file is found:
- Loading animation will show "DetectX" text instead
- Navbar and Footer continue to show text branding
- No errors will occur - it gracefully falls back

## Testing Your Logo

1. Place logo in `public/logo.png`
2. Restart dev server: `npm run dev`
3. Navigate between pages to see the loading animation
4. Your logo should appear in the center with a wipe effect!

## Logo Tips

✅ **DO:**
- Use transparent background PNG
- Keep it simple and recognizable
- Use high resolution (at least 512x512px)
- Test on both light and dark backgrounds

❌ **DON'T:**
- Use very complex logos (they won't be visible during quick transitions)
- Use text-heavy logos (hard to read at small sizes)
- Use logos with white backgrounds (won't look good on gradient)

## Need Help?

If your logo isn't showing:
1. Check the file path: `/home/lightdesk/Projects/AI-Website/public/logo.png`
2. Make sure the file is named exactly `logo.png` (lowercase)
3. Clear browser cache and refresh
4. Check browser console for any errors

---

**Current Setup:**
- Loading animation: ✅ Ready for your logo
- File location: `public/logo.png`
- Fallback: Shows "DetectX" text if logo missing


