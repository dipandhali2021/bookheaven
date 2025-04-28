'use client'

import { useCallback } from 'react'
import { useQueryStates } from 'nuqs'
import { bookSearchParamsSchema } from '@/app/books/searchParams'
import { Pagination } from '@/components/generic/pagination/Pagination'

interface BooksPaginationProps {
  currentPage: number
  pageCount: number
  totalCount: number
  pageSize: number
}

export function BooksPagination({
  currentPage,
  pageCount,
  totalCount,
  pageSize
}: BooksPaginationProps) {
  const [, setSearchParams] = useQueryStates(bookSearchParamsSchema, {
    history: 'push', // Explicitly use push to maintain history
    shallow: false // Changed to false to force page reload
  })

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams({ page: String(page) })
      // No need for manual scroll as page will reload
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
