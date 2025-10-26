# Quick SEO Setup Guide

## Immediate Setup Steps (5 minutes)

### 1. Environment Variables
Create or update `.env.local`:

```bash
# Required for SEO
NEXT_PUBLIC_SITE_URL=https://your-actual-domain.com

# For Analytics (get from Google Analytics)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# For Search Console Verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-code-here
```

### 2. Create Social Media Images

You need to create two images in the `/public` directory:

#### og-image.png (for Facebook/LinkedIn)
- Size: 1200 x 630 pixels
- Format: PNG or JPG
- Content: Your logo + tagline "Detect AI-Generated Content"
- Location: `/public/og-image.png`

#### twitter-image.png (for Twitter/X)
- Size: 1200 x 675 pixels  
- Format: PNG or JPG
- Content: Same as og-image but 16:9 ratio
- Location: `/public/twitter-image.png`

**Quick Create Options:**
- Use [Canva](https://www.canva.com/) (free templates available)
- Use [Figma](https://www.figma.com/) 
- Use [Photopea](https://www.photopea.com/) (free online Photoshop)

### 3. Set Up Google Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Get your Measurement ID (starts with G-)
4. Add it to `.env.local`

### 4. Submit to Search Engines

#### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property
3. Verify ownership (use the meta tag method)
4. Submit your sitemap: `https://yourdomain.com/sitemap.xml`

#### Bing Webmaster Tools
1. Go to [Bing Webmaster](https://www.bing.com/webmasters)
2. Add your site
3. Import from Google Search Console (easiest)
4. Submit sitemap

---

## What's Already Done ✅

- ✅ XML Sitemap (`/sitemap.xml`)
- ✅ Robots.txt (`/robots.txt`)
- ✅ Enhanced meta titles and descriptions
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Schema.org structured data
- ✅ Favicon
- ✅ Analytics component
- ✅ Layout metadata for all pages

---

## Test Your Implementation

### Before Deploying:
```bash
npm run build
npm run start
```

Then test:
- `http://localhost:3000/sitemap.xml` - Should show your sitemap
- `http://localhost:3000/robots.txt` - Should show robots.txt

### After Deploying:

1. **Test Meta Tags:**
   - [Facebook Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

2. **Test Structured Data:**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Enter your homepage URL

3. **Test Mobile & Performance:**
   - [PageSpeed Insights](https://pagespeed.web.dev/)
   - [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

## Common Issues & Solutions

### Issue: Sitemap showing 404
**Solution:** Make sure you've built the site (`npm run build`)

### Issue: Open Graph images not showing
**Solution:** 
1. Check images exist at `/public/og-image.png`
2. Clear Facebook cache using their debugger
3. Ensure image dimensions are correct

### Issue: Analytics not tracking
**Solution:**
1. Check GA_MEASUREMENT_ID is set correctly
2. Check browser has JavaScript enabled
3. Check for ad blockers
4. Wait 24-48 hours for data to appear

---

## Optional: Create Social Media Accounts

When you create these, update the social links in `/app/layout.tsx`:

- [ ] Twitter/X: twitter.com/DetectX
- [ ] Facebook: facebook.com/DetectX  
- [ ] LinkedIn: linkedin.com/company/detectx
- [ ] Instagram: instagram.com/detectx
- [ ] YouTube: youtube.com/@detectx

Update the `sameAs` array in the Organization schema.

---

## Next Steps for Better SEO

1. **Content:** Add a blog with regular posts about AI detection
2. **Backlinks:** Reach out to AI/tech sites for links
3. **Performance:** Optimize images and enable caching
4. **Mobile:** Ensure perfect mobile experience
5. **HTTPS:** Use SSL certificate (Vercel provides this)
6. **Monitor:** Check Search Console weekly
7. **Update:** Keep content fresh and relevant

---

## Need Help?

See the full documentation: `/docs/SEO_IMPLEMENTATION.md`
