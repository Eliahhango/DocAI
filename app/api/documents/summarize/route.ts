import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { summarizeDocument } from '@/lib/ai'
import { z } from 'zod'

const summarizeSchema = z.object({
  content: z.string().min(1),
  format: z.enum(['text', 'slides']).default('text'),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, format } = summarizeSchema.parse(body)

    const summary = await summarizeDocument(content, format)

    return NextResponse.json({ summary })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Document summarization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
