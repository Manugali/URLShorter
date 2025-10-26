'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Copy, Check, ExternalLink, Calendar, Link, Search, BarChart3, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ShortUrl {
  id: string
  originalUrl: string
  shortCode: string
  shortUrl: string
  clickCount: number
  createdAt: string
}

interface UrlListProps {
  urls: ShortUrl[]
}

type SortField = 'createdAt' | 'clickCount' | 'originalUrl' | 'shortCode'
type SortDirection = 'asc' | 'desc'

export function UrlList({ urls }: UrlListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleCopy = async (url: string, id: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Filter and sort URLs
  const filteredAndSortedUrls = useMemo(() => {
    let filtered = urls.filter(url => 
      url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.shortUrl.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case 'clickCount':
          aValue = a.clickCount
          bValue = b.clickCount
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'originalUrl':
          aValue = a.originalUrl.toLowerCase()
          bValue = b.originalUrl.toLowerCase()
          break
        case 'shortCode':
          aValue = a.shortCode.toLowerCase()
          bValue = b.shortCode.toLowerCase()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [urls, searchTerm, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUrls.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUrls = filteredAndSortedUrls.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
    setCurrentPage(1)
  }

  const handleCopyAll = async () => {
    const allUrls = filteredAndSortedUrls.map(url => `${url.shortUrl} -> ${url.originalUrl}`).join('\n')
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(allUrls)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = allUrls
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      alert('All URLs copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy all URLs:', err)
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
      {/* Header with Search and Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg shadow-lg shadow-purple-500/25">
              <Link className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Your Shortened URLs
            </h3>
            <Badge className="bg-purple-900/50 text-purple-300 border-purple-500/20">
              {filteredAndSortedUrls.length} URL{filteredAndSortedUrls.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          {filteredAndSortedUrls.length > 0 && (
            <Button
              onClick={handleCopyAll}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-4 py-2 rounded-lg shadow-lg shadow-green-500/25 transition-all duration-200"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
          )}
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search URLs, short codes, or original URLs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 bg-gray-800/50 border-gray-600 focus:border-purple-500 focus:ring-purple-500/20 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => handleSort('createdAt')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                sortField === 'createdAt' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Date
              {sortField === 'createdAt' && (
                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
              )}
            </Button>
            
            <Button
              onClick={() => handleSort('clickCount')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                sortField === 'clickCount' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Clicks
              {sortField === 'clickCount' && (
                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
              )}
            </Button>
            
            <Button
              onClick={() => handleSort('originalUrl')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                sortField === 'originalUrl' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              <ArrowUpDown className="h-4 w-4" />
              A-Z
              {sortField === 'originalUrl' && (
                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {paginatedUrls.map((url, index) => (
          <motion.div
            key={url.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group">
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
                      <Badge className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-300 border-green-500/20 font-medium flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {url.clickCount} clicks
                      </Badge>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === pageNum
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  {pageNum}
                </Button>
              )
            })}
            {totalPages > 5 && (
              <>
                <span className="text-gray-400 px-2">...</span>
                <Button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === totalPages
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          
          <Button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
          >
            Next
          </Button>
        </div>
      )}

      {/* Results Summary */}
      {filteredAndSortedUrls.length > 0 && (
        <div className="text-center text-sm text-gray-400 mt-4">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedUrls.length)} of {filteredAndSortedUrls.length} URLs
        </div>
      )}
    </motion.div>
  )
}
