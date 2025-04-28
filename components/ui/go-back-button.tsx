'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface GoBackButtonProps {
  href?: string
}

export function GoBackButton({ href = '/admin/dashboard/books' }: GoBackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    try {
      // If a specific href is provided, use that as the destination
      if (href) {
        router.push(href)
      } 
      // Check if we can safely go back in history
      else if (window && window.history.length > 1) {
        router.back()
      } 
      // Fallback to admin books dashboard if no history is available
      else {
        router.push('/admin/dashboard/books')
      }
    } catch (error) {
      // If anything goes wrong, use the fallback
      router.push('/admin/dashboard/books')
    }
  }

  return (
    <Button
      type='button'
      variant='outline'
      onClick={handleClick}
      className='gap-2'
    >
      <ArrowLeft className='h-4 w-4' />
      Go Back
    </Button>
  )
}
