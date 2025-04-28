import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserSearch } from './UserSearch'
import { getUsers } from './actions'
import { userSearchParamsCache } from './searchParams'
import { UserIcon } from 'lucide-react'
import { PaginationControls } from './PaginationControls'
import { UserCard, SerializableUser } from './UserCard'
import { currentUser } from '@clerk/nextjs/server'
import { SearchParams } from 'nuqs/server'

// Define a constant for page size
const DEFAULT_PAGE_SIZE = 12

export interface AdminUsersPageProps {
  searchParams: Promise<SearchParams>
}

export default async function AdminUsersPage({
  searchParams
}: AdminUsersPageProps) {
  // Use parse method as parseAsync doesn't exist
  const params = await userSearchParamsCache.parse(searchParams)
  const { q, page } = params

  const { users, totalCount, pageCount } = await getUsers({
    limit: DEFAULT_PAGE_SIZE,
    offset: (Number(page) - 1) * DEFAULT_PAGE_SIZE,
    query: q
  })

  // Get the current user
  const user = await currentUser()
  const currentUserId = user?.id || ''

  // Transform Clerk User objects to serializable format
  const serializableUsers: SerializableUser[] = users.map(user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    emailAddress: user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress || '',
    role: (user.publicMetadata?.role as string) || 'user'
  }))

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>User Management</h2>
        <p className='text-muted-foreground'>
          View, search, and manage users in your application.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <UserSearch />

          {/* Users grid view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {serializableUsers.map((user) => (
              <UserCard 
                key={user.id} 
                user={user} 
                currentUserId={currentUserId}
              />
            ))}
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-10">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
          
          {pageCount > 1 && (
            <div className="mt-8">
              <PaginationControls
                currentPage={Number(page)}
                pageCount={pageCount}
                totalCount={totalCount}
                pageSize={DEFAULT_PAGE_SIZE}
                searchParams={params}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}