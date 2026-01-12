import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rewriteDocument } from '@/lib/ai'
import { z } from 'zod'

const rewriteSchema = z.object({
  documentId: z.string(),
  instructions: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { documentId, instructions } = rewriteSchema.parse(body)

    // Get document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Check ownership
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (document.userId !== dbUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Rewrite with AI
    const originalContent = document.content || ''
    const rewrittenContent = await rewriteDocument(originalContent, instructions)

    // Create new version
    const newDocument = await prisma.document.create({
      data: {
        title: `${document.title} (Rewritten)`,
        type: document.type,
        content: rewrittenContent,
        filePath: document.filePath,
        userId: document.userId,
        status: 'COMPLETED',
        metadata: {
          ...(document.metadata as object || {}),
          rewritten: true,
          originalDocumentId: documentId,
          instructions,
        },
      },
    })

    // Create version history
    await prisma.documentVersion.create({
      data: {
        documentId: document.id,
        content: originalContent,
        filePath: document.filePath,
        version: document.version,
      },
    })

    // Update original document version
    await prisma.document.update({
      where: { id: document.id },
      data: { version: document.version + 1 },
    })

    return NextResponse.json({ document: newDocument })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Document rewrite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
