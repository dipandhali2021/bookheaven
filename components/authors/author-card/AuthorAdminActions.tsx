'use client'

import { deleteAuthor } from '@/app/actions/authors.actions'
import { Button } from '@/components/ui/button'
import { Loader2, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'next-view-transitions'
import { useState } from 'react'
import { toast } from 'sonner'

interface AuthorAdminActionsProps {
  authorId: string
  authorName: string
}

export function AuthorAdminActions({
  authorId,
  authorName
}: AuthorAdminActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${authorName} and all their books?`)) {
      return
    }

    setIsDeleting(true)
    try {
      toast.loading(`Deleting ${authorName} and all associated books...`)
      await deleteAuthor(authorId)
      toast.dismiss()
      toast.success(`${authorName} and all their books have been deleted`)
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to delete author')
      console.error('Error deleting author:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className='flex gap-2'>
      <Link href={`/forms/authors?id=${authorId}`}>
        <Button
          variant='outline'
          size='sm'
          className='text-yellow-600 hover:text-yellow-700'
          disabled={isDeleting}
        >
          <Pencil className='h-4 w-4' />
          <span className='sr-only'>Edit author</span>
        </Button>
      </Link>
      <Button
        variant='outline'
        size='sm'
        className='text-red-600 hover:text-red-700'
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <Trash2 className='h-4 w-4' />
        )}
        <span className='sr-only'>Delete author</span>
      </Button>
    </div>
  )
}
