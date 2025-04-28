'use client'

import { useCallback } from 'react'
import { useQueryStates } from 'nuqs'
import { orderSearchParamsSchema } from '@/app/user/dashboard/orders/searchParams'
import { Pagination } from '@/components/generic/pagination/Pagination'

interface OrdersPaginationProps {
  currentPage: number
  pageCount: number
  totalCount: number
  pageSize: number
}

export function OrdersPagination({
  currentPage,
  pageCount,
  totalCount,
  pageSize
}: OrdersPaginationProps) {
  const [, setSearchParams] = useQueryStates(orderSearchParamsSchema, {
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
    />
  )
}
