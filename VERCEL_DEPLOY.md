# Deploying DocAI to Vercel

This guide will walk you through deploying your DocAI application to Vercel.

## Prerequisites

- GitHub account (for connecting repository)
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (Vercel Postgres or external)
- Stripe account (for payments)
- OpenAI API key

## Step 1: Prepare Your Code

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/docai.git
   git push -u origin main
   ```

2. **Create `.vercelignore` file** (optional, to exclude files)
   ```
   node_modules
   .next
   .env
   .env.local
   .git
   uploads
   mobile-app
   ```

## Step 2: Database Setup

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to **Storage** tab
3. Click **Create Database** → Select **Postgres**
4. Choose a name for your database
5. Note the connection string (will be automatically added as `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`)

### Option B: External Database (Supabase, Neon, Railway, etc.)

1. Create a PostgreSQL database on your preferred provider
2. Get the connection string
3. You'll add this in Step 4 (Environment Variables)

## Step 3: Deploy to Vercel

1. **Go to https://vercel.com**
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

## Step 4: Configure Environment Variables

In your Vercel project settings, go to **Settings** → **Environment Variables** and add:

### Required Variables

```env
# Database (if using Vercel Postgres, these are auto-added)
DATABASE_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://your-project.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32

# OpenAI
OPENAI_API_KEY="sk-..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PREMIUM_MONTHLY_PRICE_ID="price_..."
STRIPE_PREMIUM_YEARLY_PRICE_ID="price_..."

# File Storage (use Vercel Blob or external storage)
UPLOAD_DIR="/tmp" # Temporary storage (files will be lost on redeploy)
# OR use Vercel Blob Storage (recommended for production)

# Socket.IO (if using separate server)
NEXT_PUBLIC_SOCKET_URL="wss://your-socket-server.com"
```

### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### Stripe Setup

1. Create products in Stripe Dashboard
2. Create prices for monthly and yearly subscriptions
3. Copy the Price IDs and add to environment variables
4. Set up webhook endpoint: `https://your-project.vercel.app/api/stripe/webhook`
5. Select events: `checkout.session.completed`, `customer.subscription.deleted`

## Step 5: Database Migration

After deployment, you need to run Prisma migrations:

### Option 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

### Option 2: Using Prisma Studio or Direct Connection

```bash
# Set DATABASE_URL temporarily
export DATABASE_URL="your-connection-string"

# Generate Prisma Client
npm run db:generate

# Push schema (development)
npx prisma db push

# OR create migration (production)
npx prisma migrate dev --name init
npx prisma migrate deploy
```

## Step 6: File Storage Configuration

### Option A: Vercel Blob Storage (Recommended)

1. Install Vercel Blob:
   ```bash
   npm install @vercel/blob
   ```

2. Update upload route to use Vercel Blob (see example below)

3. Add environment variable:
   ```
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
   ```

### Option B: External Storage (AWS S3, Cloudinary, etc.)

Update your upload routes to use external storage services.

### Option C: Temporary Storage (Not Recommended)

Files stored in `/tmp` will be lost on each deployment. Use only for testing.

## Step 7: Socket.IO Setup (Optional)

Vercel Serverless Functions have timeout limits, so Socket.IO should run on a separate server:

### Option 1: Separate Node.js Server

Deploy Socket.IO server separately (Railway, Render, Fly.io, etc.)

### Option 2: Use Alternatives

- Pusher
- Ably
- PubNub
- Or disable real-time features for serverless deployment

## Step 8: Build Configuration

Vercel will auto-detect Next.js, but you can customize in `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://your-project.vercel.app"
  }
}
```

## Step 9: Deploy and Test

1. Click **Deploy** in Vercel dashboard
2. Wait for build to complete
3. Visit your deployed URL
4. Test key features:
   - User registration/login
   - Document generation
   - File uploads
   - Stripe checkout
   - Webhooks

## Step 10: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

## Troubleshooting

### Database Connection Issues

- Verify connection string format
- Check if database allows connections from Vercel IPs
- Ensure connection pooling settings are correct

### Build Errors

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript errors are resolved
- Check environment variables are set

### File Upload Issues

- `/tmp` directory is cleared on each deployment
- Use Vercel Blob or external storage
- Check file size limits (Vercel has 4.5MB limit for serverless functions)

### Webhook Issues

- Verify webhook URL is correct
- Check webhook secret matches
- Ensure Stripe events are configured correctly
- Check Vercel function logs

### Environment Variables Not Working

- Ensure variables are set for correct environment (Production, Preview, Development)
- Redeploy after adding variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

## Production Checklist

- [ ] Database migrated and tested
- [ ] All environment variables configured
- [ ] Stripe webhooks configured and tested
- [ ] File storage configured (not using /tmp)
- [ ] Custom domain configured (optional)
- [ ] Error tracking set up (Sentry, etc.)
- [ ] Analytics configured (optional)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Backups configured for database
- [ ] Monitoring set up

## Vercel Blob Storage Integration Example

Update `app/api/upload/route.ts`:

```typescript
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  // ... existing code ...
  
  // Instead of writing to filesystem:
  // await writeFile(filePath, buffer)
  
  // Use Vercel Blob:
  const blob = await put(file.name, buffer, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  })
  
  // Save blob URL instead of file path
  const uploadedFile = await prisma.uploadedFile.create({
    data: {
      filename: uniqueFilename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      filePath: blob.url, // Store blob URL
      userId: dbUser.id,
    },
  })
}
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
