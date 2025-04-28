'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface GoBackButtonProps {
  text?: string
  onClick?: () => void
  fallbackPath?: string // Adding fallback path option
}

export function GoBackButton({ 
  text = 'Go back', 
  onClick, 
  fallbackPath = '/admin/dashboard/books' // Default fallback to books dashboard
}: GoBackButtonProps) {
  const router = useRouter()

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick()
    }

    try {
      // Check if we can go back in history
      if (window.history.length > 1) {
        router.back()
      } else {
        // If no history is available, navigate to the fallback path
        router.push(fallbackPath)
      }
    } catch (error) {
      // If anything goes wrong, use the fallback
      router.push(fallbackPath)
    }
  }, [onClick, router, fallbackPath])

  return (
    <div
      className='group text-muted-foreground hover:text-primary flex cursor-pointer items-center gap-2 transition-colors'
      onClick={handleClick}
    >
      <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
      {text}
    </div>
  )
}
