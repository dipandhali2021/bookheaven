'use client'

import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useQueryStates } from 'nuqs'
import { userSearchParamsSchema } from './searchParams'

export function UserSearch() {
  const router = useRouter()
  const [queryStates, setQueryStates] = useQueryStates(userSearchParamsSchema, {
    history: 'push',
    shallow: false
  })
  const [searchValue, setSearchValue] = useState(queryStates.q || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    setQueryStates({
      q: searchValue,
      page: '1' // Reset to first page on new search
    })
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
      <Input
        type="search"
        placeholder="Search users by name or email..."
        className="flex-1"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Button type="submit" size="sm">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  )
}