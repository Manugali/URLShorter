import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Link } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function RedirectPage({ params }: PageProps) {
  const { slug } = await params

  const shortUrl = await prisma.shortUrl.findUnique({
    where: { shortCode: slug },
  })

  if (!shortUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-purple-900">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-900/50 to-pink-900/50 rounded-full flex items-center justify-center border border-red-500/20">
            <Link className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            URL Not Found
          </h1>
          <p className="text-gray-400 text-lg mb-8">The short URL you're looking for doesn't exist.</p>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200"
          >
            <Link className="h-4 w-4" />
            Go back to Shortly
          </a>
        </div>
      </div>
    )
  }

  // Increment click count (fire and forget)
  console.log(`🔄 Incrementing click count for: ${slug}, current: ${shortUrl.clickCount}`)
  prisma.shortUrl.update({
    where: { shortCode: slug },
    data: { clickCount: { increment: 1 } }
  }).then(updated => {
    console.log(`✅ Click count updated: ${slug} = ${updated.clickCount}`)
  }).catch(error => {
    console.error('❌ Error updating click count:', error)
  })

  // This will throw NEXT_REDIRECT which is expected behavior
  redirect(shortUrl.originalUrl)
}
