import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateDocument } from '@/lib/ai'
import { generateWordDocument, generatePDFDocument, generatePPTXDocument } from '@/lib/documents'
import { z } from 'zod'

const generateSchema = z.object({
  type: z.enum(['word', 'pdf', 'ppt']),
  prompt: z.string().min(1),
  title: z.string().min(1),
  context: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, prompt, title, context } = generateSchema.parse(body)

    // Generate content with AI
    const content = await generateDocument(type, prompt, context)

    // Generate file
    const filename = `${Date.now()}-${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
    let filePath: string

    if (type === 'word') {
      filePath = await generateWordDocument(content, filename)
    } else if (type === 'ppt') {
      filePath = await generatePPTXDocument(content, filename)
    } else {
      filePath = await generatePDFDocument(content, filename)
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Save document to database
    const document = await prisma.document.create({
      data: {
        title,
        type: type.toUpperCase() as any,
        content,
        filePath,
        userId: dbUser.id,
        status: 'COMPLETED',
        metadata: {
          generatedBy: 'ai',
          prompt,
          context: context || null,
        },
      },
    })

    return NextResponse.json({ document })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Document generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
