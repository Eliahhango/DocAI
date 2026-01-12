# Deployment Checklist for Vercel

Use this checklist to ensure everything is ready before deploying.

## Pre-Deployment

### Code Preparation
- [ ] Code pushed to GitHub repository
- [ ] All dependencies in `package.json`
- [ ] No hardcoded secrets or API keys
- [ ] Environment variables documented
- [ ] `.vercelignore` configured
- [ ] `vercel.json` configured (if needed)

### Database
- [ ] Database created (Vercel Postgres or external)
- [ ] Connection string available
- [ ] Prisma schema finalized
- [ ] Migration strategy planned

### External Services
- [ ] Stripe account created
- [ ] Stripe products and prices created
- [ ] OpenAI API key ready
- [ ] Google OAuth credentials ready (if using)
- [ ] File storage solution chosen

## Environment Variables

### Required
- [ ] `DATABASE_URL` or `POSTGRES_PRISMA_URL`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `OPENAI_API_KEY`

### Optional (but recommended)
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_PREMIUM_MONTHLY_PRICE_ID`
- [ ] `STRIPE_PREMIUM_YEARLY_PRICE_ID`
- [ ] `BLOB_READ_WRITE_TOKEN` (if using Vercel Blob)

## Vercel Configuration

- [ ] Project created in Vercel
- [ ] Repository connected
- [ ] Environment variables added
- [ ] Build settings verified
- [ ] Region selected

## Database Setup

- [ ] Database created
- [ ] Connection string added to environment variables
- [ ] Prisma Client generated
- [ ] Schema pushed or migrated
- [ ] Test connection successful

## Stripe Configuration

- [ ] Products created in Stripe
- [ ] Prices created (monthly and yearly)
- [ ] Price IDs added to environment variables
- [ ] Webhook endpoint configured
- [ ] Webhook events selected
- [ ] Webhook secret added to environment variables
- [ ] Test webhook received

## Testing

### Local Testing
- [ ] Application runs locally
- [ ] All features tested
- [ ] No console errors
- [ ] Build succeeds (`npm run build`)

### After Deployment
- [ ] Application loads
- [ ] User registration works
- [ ] User login works
- [ ] Document generation works
- [ ] File upload works (if configured)
- [ ] Stripe checkout works
- [ ] Webhooks receive events
- [ ] Database operations work
- [ ] No errors in Vercel logs

## Post-Deployment

- [ ] Custom domain configured (if applicable)
- [ ] DNS records updated
- [ ] SSL certificate active
- [ ] Monitoring set up
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics configured (optional)
- [ ] Backups configured for database
- [ ] Documentation updated with production URLs

## Security

- [ ] All secrets in environment variables
- [ ] No API keys in code
- [ ] CORS configured correctly
- [ ] Rate limiting considered
- [ ] Input validation in place
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection in place

## Performance

- [ ] Images optimized
- [ ] Bundle size reasonable
- [ ] Database queries optimized
- [ ] Caching configured (if applicable)
- [ ] CDN configured (automatic with Vercel)

## Documentation

- [ ] README updated
- [ ] Deployment guide created
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Setup instructions clear

## Rollback Plan

- [ ] Previous version can be restored
- [ ] Database migrations are reversible (if needed)
- [ ] Environment variables backed up
- [ ] Know how to revert deployment

## Support & Monitoring

- [ ] Error tracking set up
- [ ] Logging configured
- [ ] Alerts configured (optional)
- [ ] Monitoring dashboard (optional)
- [ ] Support contact information available
