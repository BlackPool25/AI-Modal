#!/bin/bash

# SEO Implementation Test Script
# Run this after building your Next.js app to verify SEO features

echo "🔍 DetectX SEO Implementation Test"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Run this script from the project root${NC}"
    exit 1
fi

echo "📦 Building the project..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed. Fix errors and try again.${NC}"
    exit 1
fi

echo ""
echo "🚀 Starting server..."
npm run start > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo ""
echo "Testing SEO implementation..."
echo ""

# Test sitemap
echo -n "📄 Testing sitemap.xml... "
SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/sitemap.xml)
if [ "$SITEMAP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ OK${NC}"
    echo "   URL: http://localhost:3000/sitemap.xml"
else
    echo -e "${RED}❌ Failed (Status: $SITEMAP_STATUS)${NC}"
fi

# Test robots.txt
echo -n "🤖 Testing robots.txt... "
ROBOTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/robots.txt)
if [ "$ROBOTS_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ OK${NC}"
    echo "   URL: http://localhost:3000/robots.txt"
else
    echo -e "${RED}❌ Failed (Status: $ROBOTS_STATUS)${NC}"
fi

# Test favicon
echo -n "🎨 Testing favicon... "
FAVICON_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/favicon.ico)
if [ "$FAVICON_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: Favicon not found (Status: $FAVICON_STATUS)${NC}"
fi

echo ""
echo "🔍 Checking environment variables..."

# Check for required env vars
if [ -z "$NEXT_PUBLIC_SITE_URL" ]; then
    echo -e "${YELLOW}⚠️  NEXT_PUBLIC_SITE_URL not set${NC}"
else
    echo -e "${GREEN}✅ NEXT_PUBLIC_SITE_URL: $NEXT_PUBLIC_SITE_URL${NC}"
fi

if [ -z "$NEXT_PUBLIC_GA_MEASUREMENT_ID" ]; then
    echo -e "${YELLOW}⚠️  NEXT_PUBLIC_GA_MEASUREMENT_ID not set (Analytics won't work)${NC}"
else
    echo -e "${GREEN}✅ NEXT_PUBLIC_GA_MEASUREMENT_ID: $NEXT_PUBLIC_GA_MEASUREMENT_ID${NC}"
fi

echo ""
echo "📊 Checking for required images..."

# Check for OG images
if [ -f "public/og-image.png" ]; then
    echo -e "${GREEN}✅ og-image.png exists${NC}"
else
    echo -e "${YELLOW}⚠️  og-image.png missing (needed for social sharing)${NC}"
    echo "   Create: 1200x630px image at public/og-image.png"
fi

if [ -f "public/twitter-image.png" ]; then
    echo -e "${GREEN}✅ twitter-image.png exists${NC}"
else
    echo -e "${YELLOW}⚠️  twitter-image.png missing (needed for Twitter cards)${NC}"
    echo "   Create: 1200x675px image at public/twitter-image.png"
fi

# Stop the server
echo ""
echo "🛑 Stopping test server..."
kill $SERVER_PID > /dev/null 2>&1

echo ""
echo "===================================="
echo "✅ SEO Implementation Test Complete"
echo ""
echo "Next steps:"
echo "1. Set missing environment variables in .env.local"
echo "2. Create missing images (og-image.png, twitter-image.png)"
echo "3. Deploy to production"
echo "4. Test with online tools:"
echo "   - https://developers.facebook.com/tools/debug/"
echo "   - https://cards-dev.twitter.com/validator"
echo "   - https://search.google.com/test/rich-results"
echo ""
echo "📚 See docs/SEO_QUICK_START.md for detailed setup"
echo "===================================="
