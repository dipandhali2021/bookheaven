import { getOrderById } from '@/app/actions/orders.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyableText } from '@/components/ui/copyable-text'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import { checkRole } from '@/lib/auth/utils'
import { auth } from '@clerk/nextjs/server'
import { ArrowLeft, MapPin, Package, Receipt, User, Truck, CheckCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import { OrderCardBooks } from '@/components/orders/order-card/OrderCardBooks'
import { OrderCardCancelButton } from '@/components/orders/order-card/OrderCardCancelButton'
import { OrderCardAdminActions } from '@/components/orders/order-card/OrderCardAdminActions'
import { Link } from 'next-view-transitions'

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { userId } = await auth()
  const isAdmin = await checkRole('admin')
  
  if (!userId) {
    notFound()
  }

  // Get the specific order by ID with proper permission handling
  const orderId = (await params).id
  const order = await getOrderById(orderId)
  
  if (!order) {
    notFound()
  }

  if (!order.shippingAddress?.address) {
    return <div>No shipping address found for this order.</div>
  }

  const { address } = order.shippingAddress
  const formattedAddress = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country
  ]
    .filter(Boolean)
    .join(', ')

  const orderDate = new Date(order.created_at).toLocaleDateString()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Order Details</h2>
          <p className="text-muted-foreground">
            View detailed information about your order.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={isAdmin ? "/admin/dashboard/orders" : "/user/dashboard/orders"}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-amber-500" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                <CopyableText
                  text={order.id}
                  displayText={order.id}
                  className="text-sm font-mono hover:text-amber-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                <p className="text-sm">{orderDate}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Order Status</p>
                <p className="text-sm font-medium">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs 
                    ${order.status === 'Created' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'Delivering' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {order.status}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-sm font-medium">{formatCurrency(Number(order.total))}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-amber-500" />
                Customer Information
              </p>
              <div className="rounded-md border p-4 space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <CopyableText
                    text={order.userId}
                    displayText={order.userId}
                    className="text-sm font-mono hover:text-amber-500 transition-colors"
                  />
                </div>
                {order.shippingAddress.name && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
                    <p className="text-sm">{order.shippingAddress.name}</p>
                  </div>
                )}
                {order.shippingAddress.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-sm">{order.shippingAddress.phone}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                Shipping Address
              </p>
              <div className="rounded-md border p-4">
                <p className="text-sm leading-relaxed">{formattedAddress}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-amber-500" />
                Order Items
              </p>
              <div className="rounded-md border p-4">
                <OrderCardBooks items={order.items} />
              </div>
            </div>

            {/* Session ID */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Payment Session ID</p>
              <CopyableText
                text={order.stripeSessionId}
                displayText={order.stripeSessionId}
                className="text-sm font-mono hover:text-amber-500 transition-colors"
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {isAdmin && order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                <OrderCardAdminActions orderId={order.id} status={order.status} />
              )}
              
              {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                <OrderCardCancelButton orderId={order.id} />
              )}
              
              <Button variant="outline" asChild className="w-full">
                <Link href={isAdmin ? "/admin/dashboard/orders" : "/user/dashboard/orders"}>
                  Back to Orders
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}