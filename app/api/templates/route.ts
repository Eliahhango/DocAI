import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const isPremium = searchParams.get('premium') === 'true'

    const where: any = {}
    if (category) where.category = category
    if (user) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })
      // If user is not premium, filter out premium templates
      if (!dbUser || dbUser.subscription !== 'PREMIUM') {
        where.isPremium = false
      }
    } else {
      where.isPremium = false
    }

    const templates = await prisma.documentTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (!dbUser || dbUser.subscription !== 'PREMIUM') {
      return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, category, content, preview, isPremium } = body

    const template = await prisma.documentTemplate.create({
      data: {
        name,
        description,
        category,
        content,
        preview,
        isPremium: isPremium || false,
      },
    })

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
