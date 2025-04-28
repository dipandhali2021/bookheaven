'use client'

import { useCallback } from 'react'
import { useQueryStates } from 'nuqs'
import { authorSearchParamsSchema } from '@/app/authors/searchParams'
import { Pagination } from '@/components/generic/pagination/Pagination'

interface AuthorPaginationProps {
  currentPage: number
  pageCount: number
  totalCount: number
  pageSize: number
}

export function AuthorPagination({
  currentPage,
  pageCount,
  totalCount,
  pageSize
}: AuthorPaginationProps) {
  const [, setSearchParams] = useQueryStates(authorSearchParamsSchema, {
    history: 'push',
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
