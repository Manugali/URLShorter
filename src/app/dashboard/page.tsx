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
  clickCount: number
  createdAt: string
}

export default function Dashboard() {
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

  const handleUrlShortened = async (newUrl: ShortUrl) => {
    setUrls(prev => [newUrl, ...prev])
    
    // Also refresh from server to ensure consistency
    try {
      const response = await fetch('/api/urls')
      if (response.ok) {
        const data = await response.json()
        setUrls(data)
      }
    } catch (error) {
      console.error('Error refreshing URLs:', error)
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-1.5 lg:p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg lg:rounded-xl shadow-lg shadow-purple-500/25 cursor-default transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/40 group">
                <Link className="h-5 w-5 lg:h-6 lg:w-6 text-white transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent cursor-pointer transition-all duration-300 hover:from-purple-300 hover:to-violet-300">
                Shortly
              </h1>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex flex-col justify-center min-h-0">
        {/* Welcome Section - Mobile Only */}
        <div className="text-center mb-4 lg:hidden">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-4 leading-tight">
            Welcome back,<br />
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              {session?.user?.name || session?.user?.email}!
            </span>
          </h2>
          <div className="space-y-3 text-gray-300">
            <p className="text-base sm:text-lg leading-relaxed">
              Ready to create your next short link?
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm font-medium border border-purple-500/20 cursor-default transition-all duration-300 hover:bg-purple-800/40 hover:text-purple-200 hover:border-purple-400/40 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                ✨ Instant shortening
              </span>
              <span className="px-3 py-1 bg-violet-900/30 text-violet-300 rounded-full text-sm font-medium border border-violet-500/20 cursor-default transition-all duration-300 hover:bg-violet-800/40 hover:text-violet-200 hover:border-violet-400/40 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20">
                📊 Click tracking
              </span>
              <span className="px-3 py-1 bg-indigo-900/30 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/20 cursor-default transition-all duration-300 hover:bg-indigo-800/40 hover:text-indigo-200 hover:border-indigo-400/40 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20">
                🔗 Easy sharing
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Two-Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12 lg:items-start">
          {/* Left Column - URL Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="mb-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-4 leading-tight">
                    Welcome back,<br />
                    <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                      {session?.user?.name || session?.user?.email}!
                    </span>
                  </h2>
                  <div className="space-y-3 text-gray-300">
                    <p className="text-lg lg:text-xl leading-relaxed">
                      Ready to create your next short link?
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm font-medium border border-purple-500/20 cursor-default transition-all duration-300 hover:bg-purple-800/40 hover:text-purple-200 hover:border-purple-400/40 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                        ✨ Instant shortening
                      </span>
                      <span className="px-3 py-1 bg-violet-900/30 text-violet-300 rounded-full text-sm font-medium border border-violet-500/20 cursor-default transition-all duration-300 hover:bg-violet-800/40 hover:text-violet-200 hover:border-violet-400/40 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20">
                        📊 Click tracking
                      </span>
                      <span className="px-3 py-1 bg-indigo-900/30 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/20 cursor-default transition-all duration-300 hover:bg-indigo-800/40 hover:text-indigo-200 hover:border-indigo-400/40 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20">
                        🔗 Easy sharing
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <UrlForm onUrlShortened={handleUrlShortened} />
            </div>
          </div>

          {/* Right Column - URL List */}
          <div className="lg:col-span-7 xl:col-span-8">
            <UrlList urls={urls} />
          </div>
        </div>

        {/* Mobile Single Column Layout */}
        <div className="lg:hidden space-y-4">
          <UrlForm onUrlShortened={handleUrlShortened} />
          <UrlList urls={urls} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-gray-800/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="text-center text-gray-400">
            <p className="text-sm lg:text-base">&copy; 2024 Shortly. Transform long URLs into short, shareable links with enterprise-grade security and analytics.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
