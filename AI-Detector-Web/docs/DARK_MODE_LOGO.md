# 🌙 Dark Mode Logo Setup Guide

## Overview

DetectX now supports **separate logos for light and dark modes**! This means you can have:
- A logo optimized for light backgrounds (light mode)
- A different logo optimized for dark backgrounds (dark mode)

## 📁 Where to Place Your Logos

Place both logo files in the **`public`** folder:

```
AI-Website/
├── public/
│   ├── logo.png          ← Light mode logo (REQUIRED)
│   └── logo-dark.png     ← Dark mode logo (OPTIONAL)
```

## 🎨 Logo Requirements

### Light Mode Logo (`logo.png`)
- **When shown**: Light theme/background
- **Recommended colors**: Dark colors, black, or colored logos
- **Background**: Transparent PNG
- **Size**: 512x512px or larger (square)

### Dark Mode Logo (`logo-dark.png`)
- **When shown**: Dark theme/background
- **Recommended colors**: White, light colors, or inverted version
- **Background**: Transparent PNG
- **Size**: 512x512px or larger (square)

## 💡 Design Tips

### Option 1: Inverted Colors
If your light logo has dark elements:
```
logo.png       → Dark logo on transparent
logo-dark.png  → White/light logo on transparent
```

### Option 2: Different Styles
```
logo.png       → Colorful version
logo-dark.png  → Monochrome light version
```

### Option 3: Same Logo (If It Works on Both)
```
Just use logo.png only!
The system will automatically use it for both modes if logo-dark.png is missing.
```

## 🚀 How to Add Dark Mode Logo

### Quick Setup:
1. **Already have light logo**: You should have `logo.png` in the `public/` folder
2. **Create dark version**: Make a version of your logo that looks good on dark backgrounds
3. **Name it**: `logo-dark.png`
4. **Place it**: Copy to `/home/lightdesk/Projects/AI-Website/public/logo-dark.png`

### Using Terminal:
```bash
# Copy your dark mode logo
cp /path/to/your/dark-logo.png /home/lightdesk/Projects/AI-Website/public/logo-dark.png
```

### Using File Manager:
1. Open file manager
2. Navigate to `/home/lightdesk/Projects/AI-Website/public/`
3. Copy your dark logo there
4. Rename to `logo-dark.png`

## 🎯 Where Dark Mode Logo Appears

Your dark mode logo will automatically show in:

1. ✅ **Navbar** - When dark mode is active
2. ✅ **Homepage Hero** - Large logo display
3. ✅ **Loading Screen** - Page transitions
4. ✅ **Footer** - Bottom branding

## 🔄 Automatic Fallback

**Don't have a dark mode logo yet?** No problem!

- If `logo-dark.png` is **NOT found**, the system automatically uses `logo.png` for both modes
- No errors, no broken images
- Graceful fallback

## 📏 Current Logo Sizes

| Location | Light Mode | Dark Mode |
|----------|------------|-----------|
| **Navbar** | logo.png (240x240px) | logo-dark.png (240x240px) |
| **Homepage** | logo.png (256x256px) | logo-dark.png (256x256px) |
| **Loading Screen** | logo.png (512x512px) | logo-dark.png (512x512px) |
| **Footer** | logo.png (48x48px) | logo-dark.png (48x48px) |

## 🎨 Example Scenarios

### Scenario 1: Black Logo on White Background
```
logo.png       → Black logo
logo-dark.png  → White logo
Perfect! Visible on both backgrounds.
```

### Scenario 2: Colorful Logo
```
logo.png       → Blue/colorful logo
logo-dark.png  → Lighter blue/white outline version
Good for brand consistency with visibility.
```

### Scenario 3: Single Logo Works for Both
```
logo.png       → Medium contrast logo
logo-dark.png  → (not needed, logo.png works on both)
Simplest approach if your logo has good contrast.
```

## 🧪 Testing Your Logos

1. **Place both logos** in the `public/` folder
2. **Refresh browser** (Ctrl/Cmd + R)
3. **Toggle theme** using the sun/moon icon in navbar
4. **Check all locations**:
   - Navbar
   - Homepage
   - Loading screen (navigate between pages)
   - Footer

## ⚙️ How It Works

The system uses CSS classes:
- `dark:hidden` - Hides in dark mode
- `hidden dark:block` - Shows only in dark mode

When theme changes:
1. Light mode → Shows `logo.png`, hides `logo-dark.png`
2. Dark mode → Shows `logo-dark.png`, hides `logo.png`
3. If dark logo missing → Always shows `logo.png`

## 🎨 Design Tools for Creating Dark Mode Logo

### Quick Inversion (If your logo is simple):
1. Open logo in image editor (GIMP, Photoshop, etc.)
2. Invert colors (Ctrl+I in most editors)
3. Save as `logo-dark.png`

### Manual Design:
1. Open your original logo
2. Change colors to white/light versions
3. Keep the same size and proportions
4. Save as `logo-dark.png`

### Online Tools:
- Photopea (free online Photoshop): https://photopea.com
- Remove.bg (for transparent backgrounds): https://remove.bg

## 📋 Checklist

- [ ] Light mode logo placed: `public/logo.png`
- [ ] Dark mode logo created (if needed)
- [ ] Dark mode logo placed: `public/logo-dark.png`
- [ ] Both logos are square (same width/height)
- [ ] Both logos are same size (512x512px recommended)
- [ ] Both logos have transparent backgrounds
- [ ] Tested in light mode
- [ ] Tested in dark mode
- [ ] Looks good in navbar
- [ ] Looks good on homepage
- [ ] Looks good in loading screen

## 🆘 Troubleshooting

### Logo not showing in dark mode?
- Check file name is exactly `logo-dark.png` (lowercase)
- Check file is in `public/` folder
- Clear browser cache and refresh

### Logo looks blurry?
- Use higher resolution (at least 512x512px)
- Make sure it's saved as PNG, not JPEG

### Dark logo showing in light mode?
- Check you named it `logo-dark.png` not `logo.png`
- Refresh browser completely

### Want to use same logo for both?
- Just use `logo.png` only
- Delete or don't create `logo-dark.png`
- System will use light logo for both automatically

## 📧 Summary

**Files needed:**
- `public/logo.png` - Required (light mode)
- `public/logo-dark.png` - Optional (dark mode)

**If you only have one logo:**
- Just use `logo.png` and it will work for both modes!

**If you want perfect visibility:**
- Create both versions optimized for their backgrounds

---

🎉 **Your logo will automatically switch with the theme!**


