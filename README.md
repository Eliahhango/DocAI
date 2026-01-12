# DocAI

<div align="center">

**AI-Powered Document Solution**

*A modern, scalable platform for creating, editing, converting, and managing professional documents*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## Core Purpose

The platform acts as an all-in-one document assistant for students, professionals, and businesses—eliminating the need for advanced technical or formatting knowledge.

## AI Features

### Document Generation
- **AI Word Document Generator** - Generate reports, proposals, letters, resumes, and assignments instantly
- **AI PowerPoint Creator** - Create stunning presentations from topics, outlines, or documents
- **AI PDF Generator** - Generate professional PDFs from text, Word, or PowerPoint files

### Document Enhancement
- **AI Document Rewriter & Enhancer** - Improve and rewrite documents with AI-powered suggestions
- **AI Grammar & Formatting Assistant** - Get real-time grammar checks and professional formatting
- **AI Summarizer** - Summarize long documents into concise notes or slides
- **AI Translator** - Multi-language document support with professional translations

## Document Tools

### Create & Edit
- **Word Documents** (.docx) - Full-featured Word document creation and editing
- **PowerPoint Presentations** (.pptx) - Professional slide deck generation
- **PDF Documents** (.pdf) - High-quality PDF creation and editing

### Convert & Transform
- **Format Conversion** - Word ↔ PDF, PPT ↔ PDF, Text ↔ Word/PPT/PDF
- **Upload & Process** - Upload existing documents and convert them
- **Export Options** - Export with professional templates and formatting

## User Interface

- **Modern Design** - Clean, minimal UI with intuitive navigation
- **Dashboard Layout** - Centralized document management
- **Dark & Light Mode** - Toggle between themes for comfortable viewing
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Real-time Preview** - See changes as you work
- **Drag-and-Drop Upload** - Easy file upload experience

## User System

- **Authentication** - Secure email/password and Google OAuth integration
- **Personal Library** - Cloud storage for all your documents
- **Auto-save** - Never lose your work with automatic saving
- **Version History** - Track changes and restore previous versions
- **User Profiles** - Manage your account and preferences

## Monetization

### Free Plan
- Basic document generation
- Limited AI features
- Standard templates
- Community support

### Premium Subscription
- **Unlimited** document generation
- **Advanced** templates library
- **Faster** AI processing
- **Priority** support
- **Early access** to new features

## Tech Stack

<table>
<tr>
<td><strong>Frontend</strong></td>
<td>Next.js 14, React, TypeScript, Tailwind CSS</td>
</tr>
<tr>
<td><strong>Backend</strong></td>
<td>Next.js API Routes, Prisma ORM</td>
</tr>
<tr>
<td><strong>AI</strong></td>
<td>OpenAI GPT-4 Turbo</td>
</tr>
<tr>
<td><strong>Database</strong></td>
<td>PostgreSQL</td>
</tr>
<tr>
<td><strong>Authentication</strong></td>
<td>NextAuth.js (Email + Google OAuth)</td>
</tr>
<tr>
<td><strong>Payments</strong></td>
<td>Stripe</td>
</tr>
<tr>
<td><strong>File Processing</strong></td>
<td>docx, pdfkit, pptxgenjs, mammoth, pdf-parse</td>
</tr>
</table>

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Eliahhango/DocAI.git
cd DocAI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run db:generate
npm run db:push

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**For detailed deployment instructions, see [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)**

**Use the [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) to ensure everything is ready.**

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Eliahhango/DocAI)

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

## Project Structure

```
DocAI/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication routes
│   │   ├── documents/       # Document API routes
│   │   ├── stripe/          # Payment routes
│   │   └── upload/          # File upload routes
│   ├── dashboard/           # Dashboard pages
│   │   ├── documents/       # Document management
│   │   ├── generate/        # AI generation pages
│   │   └── settings/        # User settings
│   ├── login/               # Login page
│   └── signup/              # Signup page
├── components/              # React components
│   ├── layout/             # Layout components
│   ├── providers/          # Context providers
│   ├── ui/                 # UI components
│   └── collaboration/      # Collaboration features
├── lib/                     # Utility libraries
│   ├── ai.ts               # OpenAI integration
│   ├── documents.ts        # Document processing
│   ├── auth.ts             # Authentication helpers
│   └── prisma.ts           # Prisma client
├── prisma/                  # Database schema
│   └── schema.prisma       # Prisma schema
└── mobile-app/              # React Native mobile app
```

## Features Overview

<details>
<summary><strong>Core Features</strong></summary>

- AI-powered document generation (Word, PDF, PowerPoint)
- Document rewriting and enhancement
- Grammar and formatting assistance
- Multi-language translation
- Document summarization
- Format conversion (Word ↔ PDF, PPT ↔ PDF, etc.)
- File upload and processing
- Template library
- Real-time collaboration
- Version history

</details>

<details>
<summary><strong>Advanced Features</strong></summary>

- Stripe payment integration
- Premium subscription system
- Advanced document templates
- Real-time collaboration with Socket.IO
- Mobile app (React Native)
- Dark/Light mode
- Responsive design
- User authentication (Email + Google OAuth)
- Cloud storage

</details>

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm start            # Start production server

# Database
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio

# Linting
npm run lint         # Run ESLint
```

## Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup guide
- **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)** - Vercel deployment guide
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **[ENHANCEMENTS.md](./ENHANCEMENTS.md)** - Future enhancements documentation

## Security

- Environment variables for sensitive data
- Secure password hashing (bcrypt)
- Protected API routes with authentication
- File upload validation
- SQL injection protection (Prisma)
- XSS protection
- CORS configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or feature requests, please open an issue on [GitHub](https://github.com/Eliahhango/DocAI/issues).

---

<div align="center">

**Built with modern technologies and best practices**

[Next.js](https://nextjs.org/) • [TypeScript](https://www.typescriptlang.org/) • [Prisma](https://www.prisma.io/) • [OpenAI](https://openai.com/) • [Stripe](https://stripe.com/)

Created by [Eliahhango](https://github.com/Eliahhango)

</div>
