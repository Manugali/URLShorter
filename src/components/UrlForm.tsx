'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Link, Copy, Check, ExternalLink } from 'lucide-react'

interface UrlFormProps {
  onUrlShortened: (url: any) => void
}

export function UrlForm({ onUrlShortened }: UrlFormProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdUrl, setCreatedUrl] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (createdUrl?.shortUrl) {
      try {
        await navigator.clipboard.writeText(createdUrl.shortUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL')
      }

      setCreatedUrl(data)
      onUrlShortened(data)
      setUrl('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="relative group">
        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-slate-900/95 via-gray-900/90 to-slate-800/95 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-50" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl animate-pulse delay-1000" />
          
          {/* Content */}
          <div className="relative p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header Section */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/25 mb-3 cursor-default transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/40 group">
                  <Link className="h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-2 cursor-default transition-all duration-300 hover:from-blue-50 hover:via-blue-200 hover:to-blue-50">
                    Create Short Link
                  </h2>
                  <p className="text-slate-300 text-base max-w-md mx-auto leading-relaxed cursor-default transition-colors duration-300 hover:text-slate-200">
                    Transform any URL into a clean, shareable link in seconds
                  </p>
                </div>
              </div>
              
              {/* Input Section */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <Input
                    type="url"
                    placeholder="Enter your URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="relative w-full h-12 text-base bg-slate-800/80 border-2 border-slate-600/50 focus:border-blue-500 focus:ring-blue-500/30 text-white placeholder-slate-400 rounded-xl pl-4 pr-4 shadow-xl transition-all duration-300 hover:border-slate-500/70 backdrop-blur-sm"
                    disabled={isLoading}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" />
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    type="submit" 
                    disabled={isLoading || !url.trim()}
                    className="relative h-12 px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl shadow-xl shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 disabled:transform-none disabled:shadow-lg group overflow-hidden cursor-pointer disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Link className="mr-2 h-5 w-5" />
                        <span>Create Link</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/20 border border-red-800/50 rounded-2xl p-4 shadow-lg backdrop-blur-sm"
                >
                  <p className="text-red-400 text-sm font-medium text-center">
                    {error}
                  </p>
                </motion.div>
              )}
            </form>
            
            {/* Result Display */}
            {createdUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-center mb-3">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg shadow-blue-500/25 mb-2">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-blue-400">Link Created!</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={createdUrl.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-blue-400 hover:text-blue-300 text-sm font-mono break-all bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-500/20 hover:bg-blue-900/30 transition-colors cursor-pointer"
                      >
                        {createdUrl.shortUrl}
                      </a>
                      <Button
                        onClick={handleCopy}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-3 py-2 rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
