'use client'

import { useCallback } from 'react'
import { useQueryStates } from 'nuqs'
import { userSearchParamsSchema } from './searchParams'
import { Pagination } from '@/components/generic/pagination/Pagination'

interface UserPaginationProps {
  currentPage: number
  pageCount: number
  totalCount: number
  pageSize: number
  baseUrl?: string
  searchParams?: Record<string, string | string[] | undefined>
}

export function PaginationControls({
  currentPage,
  pageCount,
  totalCount,
  pageSize,
  baseUrl = '/admin/dashboard/users',
  searchParams = {}
}: UserPaginationProps) {
  const [, setSearchParams] = useQueryStates(userSearchParamsSchema, {
    shallow: false
  })

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams({ page: String(page) })
      // Scroll to top
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