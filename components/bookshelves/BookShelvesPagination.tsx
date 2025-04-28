'use client'

import { Pagination } from '@/components/generic/pagination/Pagination'
import { useQueryStates } from 'nuqs'
import { useCallback } from 'react'
import { bookShelvesSearchParamsSchema } from './bookshelves-search/shelves.searchParams'

interface BookShelvesPaginationProps {
  currentPage: number
  pageCount: number
  totalCount: number
  pageSize: number
}

export function BookShelvesPagination({
  currentPage,
  pageCount,
  totalCount,
  pageSize
}: BookShelvesPaginationProps) {
  const [, setSearchParams] = useQueryStates(bookShelvesSearchParamsSchema, {
    history: 'push',
    shallow: true
  })

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams({ page: String(page) })
      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [setSearchParams]
  )

  return (
    <Pagination
      meta={{
        page: currentPage,
        limit: pageSize,
        total: totalCount,
        pageCount
      }}
      onPageChange={handlePageChange}
      showPageSize={false}
    />
  )
}
