# 🚀 Complete Deployment Checklist

Use this checklist to deploy your AI detector with Modal, Vercel, and Supabase.

## Phase 1: Modal Setup ✅

### 1.1 Install Modal
- [ ] Install Modal: `pip install modal`
- [ ] Authenticate: `modal setup`
- [ ] Verify installation: `modal --version`

### 1.2 Prepare Model Files
- [ ] Ensure `pytorch_model.bin` exists and works
- [ ] Verify `config.json` has correct settings
- [ ] Test `handler.py` locally
- [ ] Check all dependencies in `requirements.txt`

### 1.3 Test Locally
```bash
# Test the handler locally first
python test_loading.py

# Test with Modal (local run)
modal run modal_app.py --image-path test_image.jpg
```
- [ ] Local handler test passes
- [ ] Modal local run succeeds
- [ ] Predictions are accurate

### 1.4 Deploy to Modal
```bash
modal deploy modal_app.py
```
- [ ] Deployment successful
- [ ] Note your API URL: `https://[username]--ai-vs-real-detector-fastapi-app.modal.run`
- [ ] Test health endpoint: `curl https://your-url/health`

### 1.5 Test Modal API
```bash
# Test with curl
curl -X POST https://your-url/predict \
  -H "Content-Type: application/json" \
  -d '{"image": "'"$(base64 -w 0 test.jpg)"'"}'
```
- [ ] API responds correctly
- [ ] Predictions match local tests
- [ ] Response time is acceptable (< 5s)

## Phase 2: Supabase Setup ✅

### 2.1 Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Create new project
- [ ] Note your project URL and keys

### 2.2 Database Setup
- [ ] Open SQL Editor in Supabase
- [ ] Run `supabase_schema.sql`
- [ ] Verify tables created: `detections`
- [ ] Check RLS policies are active

### 2.3 Storage Setup
- [ ] Create bucket: `detection-images`
- [ ] Set bucket to public
- [ ] Configure storage policies
- [ ] Test upload/download

### 2.4 Get Credentials
```
Project URL: https://[project-id].supabase.co
Anon Key: eyJ...
Service Key: eyJ...
```
- [ ] Copy Project URL
- [ ] Copy Anon Key (public, safe for frontend)
- [ ] Copy Service Key (private, server-side only)

## Phase 3: Vercel Setup ✅

### 3.1 Create Next.js Project (if new)
```bash
npx create-next-app@latest my-ai-detector
cd my-ai-detector
npm install @supabase/supabase-js
```
- [ ] Next.js project created
- [ ] Supabase client installed

### 3.2 Add API Client
- [ ] Copy `api_client.ts` to `lib/ai-detector-client.ts`
- [ ] Update imports if needed
- [ ] Install dependencies: `npm install`

### 3.3 Create API Route
- [ ] Create `app/api/detect/route.ts`
- [ ] Copy code from `vercel_integration.py` (TypeScript version)
- [ ] Update with your endpoints

### 3.4 Environment Variables
Create `.env.local`:
```env
MODAL_API_URL=https://your-modal-url.modal.run
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```
- [ ] All environment variables added
- [ ] Restart dev server: `npm run dev`

### 3.5 Test Locally
```bash
npm run dev
```
- [ ] Visit `http://localhost:3000`
- [ ] Test file upload
- [ ] Verify predictions work
- [ ] Check Supabase storage

### 3.6 Deploy to Vercel
```bash
npm install -g vercel
vercel
```
- [ ] Link to Vercel project
- [ ] Add environment variables in Vercel dashboard
- [ ] Deploy: `vercel --prod`
- [ ] Test production URL

## Phase 4: Integration Testing ✅

### 4.1 End-to-End Test
- [ ] Upload image via Vercel app
- [ ] Verify Modal API called
- [ ] Check image in Supabase Storage
- [ ] Confirm detection in Supabase table
- [ ] Verify response correct

### 4.2 Performance Testing
- [ ] Test cold start time (first request)
- [ ] Test warm request time
- [ ] Test batch processing
- [ ] Monitor error rates

### 4.3 Error Handling
Test these scenarios:
- [ ] Invalid image format
- [ ] Large file (> 10MB)
- [ ] Network timeout
- [ ] Invalid base64
- [ ] Rate limiting

## Phase 5: Production Optimization ✅

### 5.1 Modal Optimization
```python
# In modal_app.py, adjust:
container_idle_timeout=300  # Keep warm longer
allow_concurrent_inputs=20  # More parallelism
```
- [ ] Optimize timeouts
- [ ] Adjust concurrency limits
- [ ] Monitor costs
- [ ] Set up alerts

### 5.2 Vercel Optimization
- [ ] Add request caching
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Set up error tracking (Sentry)

### 5.3 Supabase Optimization
- [ ] Enable database backups
- [ ] Set up storage lifecycle rules
- [ ] Monitor storage usage
- [ ] Add database indexes

### 5.4 CORS & Security
In `modal_app.py`:
```python
allow_origins=["https://your-app.vercel.app"]  # Specific domain
```
- [ ] Update CORS to specific domains
- [ ] Add API key authentication (optional)
- [ ] Enable rate limiting
- [ ] Set up monitoring

## Phase 6: Monitoring & Maintenance ✅

### 6.1 Set Up Monitoring
- [ ] Modal dashboard: https://modal.com/apps
- [ ] Vercel Analytics: Enable in project settings
- [ ] Supabase monitoring: Check dashboard
- [ ] Set up alerts for errors

### 6.2 Regular Checks
Weekly:
- [ ] Check Modal logs for errors
- [ ] Review Vercel function logs
- [ ] Monitor Supabase usage
- [ ] Check storage costs

Monthly:
- [ ] Review and optimize costs
- [ ] Update dependencies
- [ ] Clean up old images (if needed)
- [ ] Performance audit

### 6.3 Cost Monitoring
- [ ] Modal: Check GPU hours used
- [ ] Vercel: Review function executions
- [ ] Supabase: Monitor storage & bandwidth
- [ ] Set billing alerts

## Troubleshooting Common Issues 🔧

### Modal Issues

**Cold Start Too Slow**
```python
# Keep container warm
container_idle_timeout=600  # 10 minutes
```

**Out of Memory**
```python
# Use larger GPU
gpu="A10G"  # 24GB instead of T4's 16GB
```

**Model Loading Fails**
- Check `pytorch_model.bin` is included in image
- Verify file paths: `ls /root/` in container
- Test handler locally first

### Vercel Issues

**Request Timeout**
- Increase function timeout (max 60s on Pro)
- Check Modal API response time
- Add timeout handling

**CORS Errors**
- Update `allow_origins` in Modal
- Add CORS headers in Vercel route
- Check browser console for details

### Supabase Issues

**Upload Fails**
- Check bucket exists and is public
- Verify storage policies
- Check file size limits

**Database Insert Fails**
- Verify schema matches data
- Check RLS policies
- Ensure user_id is valid UUID

## Quick Reference 📚

### Important URLs
```
Modal Dashboard: https://modal.com/apps
Modal Docs: https://modal.com/docs
Vercel Dashboard: https://vercel.com/dashboard
Supabase Dashboard: https://app.supabase.com
```

### Useful Commands
```bash
# Modal
modal deploy modal_app.py
modal app logs ai-vs-real-detector
modal app stop ai-vs-real-detector

# Vercel
vercel
vercel --prod
vercel logs

# Next.js
npm run dev
npm run build
npm run start
```

### Environment Variables Template
```env
# Modal API
MODAL_API_URL=https://[username]--ai-vs-real-detector-fastapi-app.modal.run

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# Optional
SENTRY_DSN=https://...
ENABLE_RATE_LIMITING=true
```

## Success Criteria ✨

Your deployment is successful when:
- [ ] Modal API returns predictions in < 3s (warm)
- [ ] Vercel app successfully uploads and displays results
- [ ] Images stored in Supabase Storage
- [ ] Detections saved to Supabase database
- [ ] No errors in logs
- [ ] Cold starts complete in < 15s
- [ ] Cost is within budget

## Next Steps 🎯

After successful deployment:
1. Add authentication (Supabase Auth)
2. Create user dashboard
3. Add detection history view
4. Implement batch upload
5. Add analytics/charts
6. Create mobile app (React Native)
7. Add webhook notifications
8. Implement API caching

## Support & Resources

- **Modal Support**: Discord community, docs
- **Vercel Support**: GitHub discussions, docs
- **Supabase Support**: Discord, GitHub discussions
- **This Project**: Check `MODAL_DEPLOYMENT_GUIDE.md`

---

**Last Updated**: October 2025
**Status**: Ready for deployment ✅
