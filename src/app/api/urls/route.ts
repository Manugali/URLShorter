import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const urls = await prisma.shortUrl.findMany({
      where: {
        userId: session.user.id,
      } as any,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const urlsWithShortUrl = urls.map(url => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${baseUrl}/${url.shortCode}`,
      createdAt: url.createdAt,
    }))

    return NextResponse.json(urlsWithShortUrl)
  } catch (error) {
    console.error('Error fetching URLs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
