# DocAI - AI-Powered Document Solution

A modern, scalable AI-powered document solution website that helps users easily create, edit, convert, and manage professional documents.

## 🎯 Features

### Core AI Features
- **AI Word Document Generator** - Generate reports, proposals, letters, resumes, assignments
- **AI PowerPoint Generator** - Create presentations from topics, outlines, or documents
- **AI PDF Generator** - Generate PDFs from text, Word, or PPT
- **AI Document Rewriter & Enhancer** - Improve and rewrite documents with AI
- **AI Grammar & Formatting Assistant** - Get real-time grammar checks
- **AI Summarizer** - Summarize long documents into short notes or slides
- **AI Translator** - Multi-language document support

### Document Tools
- Create & edit Word (.docx), PowerPoint (.pptx), and PDF (.pdf) documents
- Convert between formats (Word ↔ PDF, PPT ↔ PDF, etc.)
- Upload & edit existing documents
- Export with professional templates
- Document library with version history

### UI/UX
- Clean, modern, minimal UI
- Dashboard-based layout
- Drag-and-drop document upload (ready for implementation)
- Real-time preview for documents
- Dark & Light mode
- Mobile-responsive design

### User System
- User authentication (email, Google OAuth)
- Personal document library
- Auto-save & version history
- Cloud storage per user

### Monetization
- Free plan with limits
- Premium subscription system (framework ready)
- Unlimited document generation (Premium)
- Advanced templates (Premium)
- Faster AI processing (Premium)

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **AI**: OpenAI GPT-4 Turbo
- **File Handling**: docx, pdfkit, pptxgenjs, mammoth, pdf-parse
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: NextAuth.js (Email + Google OAuth)
- **Hosting**: Ready for Vercel/AWS

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd docai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/docai?schema=public"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # OAuth (Google)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"

   # File Storage
   UPLOAD_DIR="./uploads"
   MAX_FILE_SIZE=10485760
   ```

   Generate a NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # (Optional) Open Prisma Studio
   npm run db:studio
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

### OpenAI Setup
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add the key to `.env` as `OPENAI_API_KEY`

## 📁 Project Structure

```
docai/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication routes
│   │   └── documents/       # Document API routes
│   ├── dashboard/           # Dashboard pages
│   │   ├── documents/       # Document management
│   │   ├── generate/        # AI generation pages
│   │   └── settings/        # User settings
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── layout/             # Layout components
│   ├── providers/          # Context providers
│   └── ui/                 # UI components
├── lib/                     # Utility libraries
│   ├── ai.ts               # OpenAI integration
│   ├── documents.ts        # Document processing
│   ├── auth.ts             # Authentication helpers
│   └── prisma.ts           # Prisma client
├── prisma/                  # Database schema
│   └── schema.prisma       # Prisma schema
└── types/                   # TypeScript types
```

## 🎨 Key Features Implementation

### AI Document Generation
- Uses OpenAI GPT-4 Turbo for content generation
- Supports Word, PDF, and PowerPoint formats
- Context-aware generation with user prompts
- Professional formatting and structure

### Document Processing
- Word document generation using `docx` library
- PDF generation using `pdfkit`
- PowerPoint generation using `pptxgenjs`
- File conversion capabilities (framework ready)

### Authentication
- NextAuth.js with email/password and Google OAuth
- Secure session management
- Protected API routes
- User profile management

### Database
- PostgreSQL database via Prisma ORM
- User management
- Document storage with version history
- Subscription tracking

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**For detailed deployment instructions, see [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)**

**Use the [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) to ensure everything is ready.**

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/docai)

### Database Setup
For production, use a managed PostgreSQL database:
- Vercel Postgres (Recommended - integrates seamlessly)
- Supabase
- Neon
- AWS RDS
- Railway

Update `DATABASE_URL` in production environment variables.

### File Storage
For production file storage:
- Vercel Blob Storage (Recommended)
- AWS S3
- Cloudinary
- Or external storage service

**Note:** Do not use local filesystem (`/uploads`) in production as files will be lost on each deployment.

## 🔒 Security

- Environment variables for sensitive data
- Secure password hashing (bcrypt)
- Protected API routes with authentication
- File upload validation
- SQL injection protection (Prisma)

## 📝 Future Enhancements

- [ ] File upload with drag-and-drop
- [ ] Real-time collaboration
- [ ] Advanced document templates
- [ ] Plagiarism checking
- [ ] Team workspaces
- [ ] Mobile app (React Native)
- [ ] Advanced AI features (charts, tables)
- [ ] Payment integration (Stripe)
- [ ] Analytics dashboard
- [ ] Document sharing and permissions

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, TypeScript, and OpenAI
