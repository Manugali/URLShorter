'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, ExternalLink, Calendar, Link } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ShortUrl {
  id: string
  originalUrl: string
  shortCode: string
  shortUrl: string
  createdAt: string
}

interface UrlListProps {
  urls: ShortUrl[]
}

export function UrlList({ urls }: UrlListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (urls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-900/50 to-violet-900/50 rounded-full flex items-center justify-center border border-purple-500/20">
          <Link className="h-8 w-8 text-purple-400" />
        </div>
        <p className="text-gray-400 text-lg">No URLs shortened yet. Create your first one above!</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-5xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg shadow-lg shadow-purple-500/25">
          <Link className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Your Shortened URLs
        </h3>
      </div>
      
      <AnimatePresence>
        {urls.map((url, index) => (
          <motion.div
            key={url.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-gradient-to-r from-purple-900/50 to-violet-900/50 text-purple-300 border-purple-500/20 font-medium">
                        {url.shortCode}
                      </Badge>
                      <span className="text-sm text-gray-400 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(new Date(url.createdAt))}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-semibold text-gray-300 min-w-0">Short URL:</span>
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 text-sm font-mono break-all bg-purple-900/20 px-3 py-2 rounded-lg border border-purple-500/20 hover:bg-purple-900/30 transition-colors"
                        >
                          {url.shortUrl}
                        </a>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-semibold text-gray-300 min-w-0">Original:</span>
                        <a
                          href={url.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-300 text-sm break-all flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-600/50 hover:bg-gray-800/70 transition-colors"
                        >
                          {url.originalUrl}
                          <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleCopy(url.shortUrl, url.id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium px-6 py-2 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200"
                    >
                      {copiedId === url.id ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
