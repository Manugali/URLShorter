'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Link } from 'lucide-react'

interface UrlFormProps {
  onUrlShortened: (url: any) => void
}

export function UrlForm({ onUrlShortened }: UrlFormProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
    >
      <Card className="w-full max-w-3xl mx-auto bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 shadow-2xl shadow-purple-500/10">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg shadow-lg shadow-purple-500/25">
                <Link className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Shorten your URL
              </h2>
            </div>
            
            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="Enter your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 h-12 text-lg bg-gray-800/50 border-2 border-gray-600 focus:border-purple-500 focus:ring-purple-500/20 text-white placeholder-gray-400 rounded-xl"
                disabled={isLoading}
                required
              />
              <Button 
                type="submit" 
                disabled={isLoading || !url.trim()}
                className="h-12 px-8 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Shortening...
                  </>
                ) : (
                  'Shorten'
                )}
              </Button>
            </div>
            
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm font-medium bg-red-900/20 p-3 rounded-lg border border-red-800/50"
              >
                {error}
              </motion.p>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
