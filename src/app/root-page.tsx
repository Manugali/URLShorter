'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function RootPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/landing')
    } else if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        <span className="text-xl text-white">Loading...</span>
      </div>
    </div>
  )
}
