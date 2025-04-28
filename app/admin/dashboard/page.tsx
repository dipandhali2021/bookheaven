import { getAdminDashboardData } from '@/components/admin/dashboard/dashboard-navigation/dashboard.actions'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  BookIcon,
  BookmarkIcon,
  HeartIcon,
  PackageIcon,
  TagIcon,
  UsersIcon
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const {
    ordersCount,
    authorsCount,
    booksCount,
    bookShelvesCount,
    totalReviewsCount,
    totalTagsCount
  } = await getAdminDashboardData()

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>Overview</h2>
        <p className='text-muted-foreground'>
          Welcome to the BookHeaven admin dashboard. Manage orders, authors, and
          books.
        </p>
      </div>

      <Separator />

      <div className='grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='p-2 sm:p-4'>
          <CardHeader className='pb-0 sm:pb-2 p-0 sm:p-6 pt-2 sm:pt-0'>
            <div className='flex items-center gap-1 sm:gap-2'>
              <PackageIcon className='h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground' />
              <CardTitle className='text-xs sm:text-sm font-medium'>
                Orders
              </CardTitle>
            </div>
            <CardDescription className='text-xs'>All user orders</CardDescription>
          </CardHeader>
          <CardContent className='p-0 sm:p-6 pt-2'>
            <div className='text-xl sm:text-2xl font-bold'>{ordersCount}</div>
          </CardContent>
        </Card>

        <Card className='p-2 sm:p-4'>
          <CardHeader className='pb-0 sm:pb-2 p-0 sm:p-6 pt-2 sm:pt-0'>
            <div className='flex items-center gap-1 sm:gap-2'>
              <UsersIcon className='h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground' />
              <CardTitle className='text-xs sm:text-sm font-medium'>Authors</CardTitle>
            </div>
            <CardDescription className='text-xs'>Registered authors</CardDescription>
          </CardHeader>
          <CardContent className='p-0 sm:p-6 pt-2'>
            <div className='text-xl sm:text-2xl font-bold'>{authorsCount}</div>
          </CardContent>
        </Card>

        <Card className='p-2 sm:p-4'>
          <CardHeader className='pb-0 sm:pb-2 p-0 sm:p-6 pt-2 sm:pt-0'>
            <div className='flex items-center gap-1 sm:gap-2'>
              <BookIcon className='h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground' />
              <CardTitle className='text-xs sm:text-sm font-medium'>Books</CardTitle>
            </div>
            <CardDescription className='text-xs'>Books in catalog</CardDescription>
          </CardHeader>
          <CardContent className='p-0 sm:p-6 pt-2'>
            <div className='text-xl sm:text-2xl font-bold'>{booksCount}</div>
          </CardContent>
        </Card>

        <Card className='p-2 sm:p-4'>
          <CardHeader className='pb-0 sm:pb-2 p-0 sm:p-6 pt-2 sm:pt-0'>
            <div className='flex items-center gap-1 sm:gap-2'>
              <BookmarkIcon className='h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground' />
              <CardTitle className='text-xs sm:text-sm font-medium'>
                Shelves
              </CardTitle>
            </div>
            <CardDescription className='text-xs'>User book shelves</CardDescription>
          </CardHeader>
          <CardContent className='p-0 sm:p-6 pt-2'>
            <div className='text-xl sm:text-2xl font-bold'>{bookShelvesCount}</div>
          </CardContent>
        </Card>

        <Card className='p-2 sm:p-4'>
          <CardHeader className='pb-0 sm:pb-2 p-0 sm:p-6 pt-2 sm:pt-0'>
            <div className='flex items-center gap-1 sm:gap-2'>
              <HeartIcon className='h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground' />
              <CardTitle className='text-xs sm:text-sm font-medium'>Reviews</CardTitle>
            </div>
            <CardDescription className='text-xs'>User reviews</CardDescription>
          </CardHeader>
          <CardContent className='p-0 sm:p-6 pt-2'>
            <div className='text-xl sm:text-2xl font-bold'>{totalReviewsCount}</div>
          </CardContent>
        </Card>

        <Card className='p-2 sm:p-4'>
          <CardHeader className='pb-0 sm:pb-2 p-0 sm:p-6 pt-2 sm:pt-0'>
            <div className='flex items-center gap-1 sm:gap-2'>
              <TagIcon className='h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground' />
              <CardTitle className='text-xs sm:text-sm font-medium'>Tags</CardTitle>
            </div>
            <CardDescription className='text-xs'>Book tags</CardDescription>
          </CardHeader>
          <CardContent className='p-0 sm:p-6 pt-2'>
            <div className='text-xl sm:text-2xl font-bold'>{totalTagsCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
