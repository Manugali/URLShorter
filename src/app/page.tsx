'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UrlForm } from '@/components/UrlForm'
import { UrlList } from '@/components/UrlList'
import { AuthButton } from '@/components/AuthButton'
import { Link, Loader2 } from 'lucide-react'

interface ShortUrl {
  id: string
  originalUrl: string
  shortCode: string
  shortUrl: string
  createdAt: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [urls, setUrls] = useState<ShortUrl[]>([])

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/landing')
    }
  }, [status, router])

  // Load URLs from database if authenticated
  useEffect(() => {
    const loadUrls = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/urls')
          if (response.ok) {
            const data = await response.json()
            setUrls(data)
          }
        } catch (error) {
          console.error('Error loading URLs from database:', error)
        }
      }
    }

    if (session?.user?.id) {
      loadUrls()
    }
  }, [session])

  const handleUrlShortened = (newUrl: ShortUrl) => {
    setUrls(prev => [newUrl, ...prev])
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <span className="text-xl text-white">Loading...</span>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex flex-col">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl shadow-lg shadow-purple-500/25">
                <Link className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                Shortly
              </h1>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-6">
            Shorten your URLs instantly
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Create short, memorable links that are easy to share and track. 
            Perfect for social media, marketing campaigns, and more.
          </p>
        </div>

        <div className="space-y-16">
          <UrlForm onUrlShortened={handleUrlShortened} />
          <UrlList urls={urls} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-gray-800/50 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Shortly. Transform long URLs into short, shareable links with enterprise-grade security and analytics.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}