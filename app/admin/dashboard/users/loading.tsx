import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserSearch } from './UserSearch'
import { UserCardSkeleton } from './UserCardSkeleton'

export default function LoadingUsersPage() {
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

          {/* Users grid with skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <UserCardSkeleton key={index} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}