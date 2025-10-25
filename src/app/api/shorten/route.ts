import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isValidUrl, generateShortCode } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    const { url } = body

    // Validate request body
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required and must be a string' },
        { status: 400 }
      )
    }

    // Trim whitespace
    const trimmedUrl = url.trim()
    
    if (!trimmedUrl) {
      return NextResponse.json(
        { error: 'URL cannot be empty' },
        { status: 400 }
      )
    }

    // Validate URL format
    if (!isValidUrl(trimmedUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format. Please include http:// or https://' },
        { status: 400 }
      )
    }

    // Generate unique short code
    let shortCode: string
    let attempts = 0
    const maxAttempts = 10

    do {
      shortCode = generateShortCode()
      attempts++
      
      if (attempts > maxAttempts) {
        return NextResponse.json(
          { error: 'Failed to generate unique short code' },
          { status: 500 }
        )
      }
    } while (await prisma.shortUrl.findUnique({ where: { shortCode } }))

    // Save to database
    const shortUrl = await prisma.shortUrl.create({
      data: {
        originalUrl: trimmedUrl,
        shortCode,
        userId: session?.user?.id || null,
      } as any,
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const shortUrlWithDomain = `${baseUrl}/${shortCode}`

    return NextResponse.json({
      id: shortUrl.id,
      originalUrl: shortUrl.originalUrl,
      shortCode: shortUrl.shortCode,
      shortUrl: shortUrlWithDomain,
      createdAt: shortUrl.createdAt,
    })
  } catch (error) {
    console.error('Error creating short URL:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
