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
  const itemsPerPage = 3

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

  if (filteredAndSortedUrls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-900/50 to-violet-900/50 rounded-full flex items-center justify-center border border-purple-500/20">
          <Link className="h-8 w-8 text-purple-400" />
        </div>
        <p className="text-gray-400 text-lg">
          {urls.length === 0 
            ? "No URLs shortened yet. Create your first one above!" 
            : "No URLs match your search criteria. Try adjusting your search terms."
          }
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full space-y-6"
    >
      {/* Header with Search and Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg shadow-lg shadow-purple-500/25 cursor-default transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/40 group">
              <Link className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent cursor-default transition-all duration-300 hover:from-gray-100 hover:to-gray-200">
              Your URLs
            </h3>
            <Badge className="bg-purple-900/50 text-purple-300 border-purple-500/20 cursor-default transition-all duration-300 hover:bg-purple-800/60 hover:text-purple-200 hover:border-purple-400/40 hover:scale-105">
              {filteredAndSortedUrls.length}
            </Badge>
          </div>
          {filteredAndSortedUrls.length > 0 && (
            <Button
              onClick={handleCopyAll}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-200 self-start sm:self-auto cursor-pointer"
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
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
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
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
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
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
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
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-4"
        >
          {paginatedUrls.map((url, index) => (
            <div key={url.id}>
              <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className="bg-gradient-to-r from-purple-900/50 to-violet-900/50 text-purple-300 border-purple-500/20 font-medium">
                          {url.shortCode}
                        </Badge>
                        <span className="text-sm text-gray-400 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(new Date(url.createdAt))}
                        </span>
                        <Badge className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-blue-300 border-blue-500/20 font-medium flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          {url.clickCount} clicks
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex flex-col gap-2">
                          <span className="text-sm font-semibold text-gray-300">Short URL:</span>
                          <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 text-sm font-mono break-all bg-purple-900/20 px-3 py-2 rounded-lg border border-purple-500/20 hover:bg-purple-900/30 transition-colors cursor-pointer"
                          >
                            {url.shortUrl}
                          </a>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <span className="text-sm font-semibold text-gray-300">Original:</span>
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-300 text-sm break-all flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-600/50 hover:bg-gray-800/70 transition-colors cursor-pointer"
                          >
                            <span className="flex-1 min-w-0 break-all">{url.originalUrl}</span>
                            <ExternalLink className="h-4 w-4 flex-shrink-0" />
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3 lg:mt-0">
                      <Button
                        onClick={() => handleCopy(url.shortUrl, url.id)}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium px-4 py-2 rounded-lg shadow-lg shadow-purple-500/25 transition-all duration-200 cursor-pointer text-sm sm:text-base"
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
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-gray-300 hover:from-gray-600/50 hover:to-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl text-sm"
            >
              Previous
            </Button>
          </motion.div>
          
          <div className="flex flex-wrap items-center justify-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <motion.div
                  key={pageNum}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl text-sm ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/25'
                        : 'bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-gray-300 hover:from-gray-600/50 hover:to-gray-500/50'
                    }`}
                  >
                    {pageNum}
                  </Button>
                </motion.div>
              )
            })}
            {totalPages > 5 && (
              <>
                <motion.span 
                  className="text-gray-400 px-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ...
                </motion.span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl text-sm ${
                      currentPage === totalPages
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/25'
                        : 'bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-gray-300 hover:from-gray-600/50 hover:to-gray-500/50'
                    }`}
                  >
                    {totalPages}
                  </Button>
                </motion.div>
              </>
            )}
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-gray-300 hover:from-gray-600/50 hover:to-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl text-sm"
            >
              Next
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Results Summary */}
      {filteredAndSortedUrls.length > 0 && (
        <div className="text-center text-sm text-gray-400 mt-2">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedUrls.length)} of {filteredAndSortedUrls.length} URLs
        </div>
      )}
    </motion.div>
  )
}
