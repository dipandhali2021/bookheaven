import { getAdminUserIds } from '@/app/admin/dashboard/users/actions'
import { getOrders } from '@/app/actions/orders.actions'
import { orderSearchParamsCache } from '@/app/user/dashboard/orders/searchParams'
import { OrdersFilter } from '@/components/orders/orders-filter'
import { OrderCard } from '@/components/orders/order-card/OrderCard'
import { OrdersPagination } from '@/components/orders/orders-pagiantion/OrdersPagination'
import { OrdersSearch } from '@/components/orders/orders-search/OrdersSearch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SearchParams } from 'nuqs/server'

const DEFAULT_PAGE_SIZE = 6

interface AdminOrdersPageProps {
  searchParams: Promise<SearchParams>
}

export default async function AdminOrdersPage({
  searchParams
}: AdminOrdersPageProps) {
  const params = await orderSearchParamsCache.parse(searchParams)
  const filterMode = params.filter || 'all'
  
  // Get admin user IDs if we're filtering to show only non-admin orders
  let adminUserIds: string[] = []
  let userIdFilter: string[] | undefined = undefined
  
  if (filterMode === 'user') {
    adminUserIds = await getAdminUserIds()
    // If we have admin IDs and want to show only user orders,
    // we use an empty array for userIds to get ALL users, then filter out admin orders client-side
  }

  const { orders, totalCount, pageCount } = await getOrders({
    limit: DEFAULT_PAGE_SIZE,
    offset: (Number(params.page) - 1) * DEFAULT_PAGE_SIZE,
    search: params.q,
    userIds: userIdFilter
  })
  
  // If we're in 'user' mode, filter out admin orders
  const filteredOrders = filterMode === 'user' 
    ? orders.filter(order => !adminUserIds.includes(order.userId))
    : orders

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>User Orders</h2>
        <p className='text-muted-foreground'>
          View and manage all user orders in the system.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Orders Management</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1">
              <OrdersSearch />
            </div>
            <div className="md:w-auto">
              <OrdersFilter />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} isAdmin={true} />
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
              <div className='p-6 text-center text-muted-foreground'>
                No orders found.
              </div>
            </div>
          )}

          {totalCount > DEFAULT_PAGE_SIZE && (
            <div className='mt-8'>
              <OrdersPagination
                currentPage={Number(params.page)}
                pageCount={pageCount}
                totalCount={totalCount}
                pageSize={DEFAULT_PAGE_SIZE}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
