import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { readFile } from 'fs/promises'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'
import { generateWordDocument, generatePDFDocument, generatePPTXDocument } from '@/lib/documents'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fileId, title } = body

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get uploaded file
    const uploadedFile = await prisma.uploadedFile.findUnique({
      where: { id: fileId },
    })

    if (!uploadedFile || uploadedFile.userId !== dbUser.id) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Read and parse file
    const fileBuffer = await readFile(uploadedFile.filePath)
    let content = ''
    let documentType: 'WORD' | 'PDF' | 'POWERPOINT' | 'TEXT' = 'TEXT'

    if (uploadedFile.mimeType.includes('pdf')) {
      const pdfData = await pdfParse(fileBuffer)
      content = pdfData.text
      documentType = 'PDF'
    } else if (uploadedFile.mimeType.includes('word') || uploadedFile.mimeType.includes('docx')) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer })
      content = result.value
      documentType = 'WORD'
    } else if (uploadedFile.mimeType.includes('text')) {
      content = fileBuffer.toString('utf-8')
      documentType = 'TEXT'
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    // Create document
    const filename = `${Date.now()}-${title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'document'}`
    let filePath: string

    if (documentType === 'WORD') {
      filePath = await generateWordDocument(content, filename)
    } else if (documentType === 'PDF') {
      filePath = await generatePDFDocument(content, filename)
    } else {
      filePath = uploadedFile.filePath
    }

    const document = await prisma.document.create({
      data: {
        title: title || uploadedFile.originalName,
        type: documentType,
        content,
        filePath,
        userId: dbUser.id,
        status: 'COMPLETED',
        metadata: {
          uploaded: true,
          originalFile: uploadedFile.originalName,
        },
      },
    })

    // Link uploaded file to document
    await prisma.uploadedFile.update({
      where: { id: fileId },
      data: { documentId: document.id },
    })

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
