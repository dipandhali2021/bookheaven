'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCallback } from 'react'

export function OrdersFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )
  
  const currentFilter = searchParams.get('filter') || 'all' 
  
  return (
    <div className="mb-4">
      <Tabs defaultValue={currentFilter} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger 
            value="all" 
            onClick={() => {
              router.push(`?${createQueryString('filter', 'all')}`)
            }}
          >
            All Orders
          </TabsTrigger>
          <TabsTrigger 
            value="user" 
            onClick={() => {
              router.push(`?${createQueryString('filter', 'user')}`)
            }}
          >
            User Orders Only
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}