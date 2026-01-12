# DocAI - Quick Setup Guide

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (local or cloud)
- OpenAI API key
- Google OAuth credentials (optional, for Google sign-in)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/docai?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth (Google) - Optional
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI - Required for AI features
OPENAI_API_KEY="your-openai-api-key"

# File Storage
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760
```

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

**Note:** For production, use a managed PostgreSQL database like:
- Vercel Postgres
- Supabase
- AWS RDS
- Railway

### 4. Set Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

### 5. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Add to `.env` as `OPENAI_API_KEY`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Create Your First Account

1. Go to http://localhost:3000/signup
2. Create an account with email/password
3. Or use Google OAuth if configured
4. Start creating documents!

## Project Structure Overview

```
docai/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── ui/               # UI components
├── lib/                   # Utility libraries
│   ├── ai.ts            # OpenAI integration
│   ├── documents.ts     # Document processing
│   └── prisma.ts        # Database client
└── prisma/               # Database schema
    └── schema.prisma    # Prisma schema
```

## Key Features

### AI Features
- ✅ Word Document Generator
- ✅ PowerPoint Generator
- ✅ PDF Generator
- ✅ Document Rewriter & Enhancer
- ✅ AI Summarizer (API ready)
- ✅ AI Translator (API ready)

### Document Management
- ✅ Document Library
- ✅ Document Preview
- ✅ Document Download
- ✅ Version History (database ready)
- ✅ Document Deletion

### User Features
- ✅ Email/Password Authentication
- ✅ Google OAuth
- ✅ Dark/Light Mode
- ✅ Responsive Design
- ✅ User Settings

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npm run db:studio

# Generate Prisma Client
npm run db:generate

# Push schema changes to database
npm run db:push
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists
- Check credentials

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- For Google OAuth, verify redirect URI matches

### OpenAI API Issues
- Verify API key is correct
- Check API quota/billing
- Ensure API key has access to GPT-4

### File Upload Issues
- Ensure uploads directory exists and is writable
- Check file size limits
- Verify UPLOAD_DIR path

## Next Steps

1. **Deploy to Production**
   - See [VERCEL_DEPLOY.md](../VERCEL_DEPLOY.md) for detailed Vercel deployment instructions
   - Use [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md) to ensure everything is ready
   - Set up production database (Vercel Postgres recommended)
   - Configure environment variables
   - Set up file storage (Vercel Blob recommended)

2. **Add Payment Integration**
   - Integrate Stripe for subscriptions
   - Set up premium features
   - Configure pricing plans

3. **Enhance Features**
   - Add file upload functionality
   - Implement real-time collaboration
   - Add more document templates
   - Enhance AI features

## Support

For issues or questions, please check:
- README.md for detailed documentation
- GitHub Issues for known problems
- OpenAI API documentation for AI-related issues
