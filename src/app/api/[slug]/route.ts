import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Validate slug
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid short code' },
        { status: 400 }
      )
    }

    // Trim and validate slug length
    const trimmedSlug = slug.trim()
    if (!trimmedSlug || trimmedSlug.length > 50) {
      return NextResponse.json(
        { error: 'Invalid short code format' },
        { status: 400 }
      )
    }

    // Find the original URL and increment click count
    const shortUrl = await prisma.shortUrl.findUnique({
      where: { shortCode: trimmedSlug },
    })

    if (!shortUrl) {
      return NextResponse.json(
        { error: 'Short URL not found' },
        { status: 404 }
      )
    }

    // Increment click count (fire and forget)
    console.log(`🔄 Incrementing click count for: ${trimmedSlug}, current: ${shortUrl.clickCount}`)
    prisma.shortUrl.update({
      where: { shortCode: trimmedSlug },
      data: { clickCount: { increment: 1 } }
    }).then(updated => {
      console.log(`✅ Click count updated: ${trimmedSlug} = ${updated.clickCount}`)
    }).catch(error => {
      console.error('❌ Error updating click count:', error)
    })

    // Redirect to the original URL
    return NextResponse.redirect(shortUrl.originalUrl)
  } catch (error) {
    console.error('Error redirecting:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
