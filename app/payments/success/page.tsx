import { Link } from 'next-view-transitions'
import { CheckCircle2, Package, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { retrieveCheckoutSession } from '@/app/actions/payments.actions'
import { formatCurrency } from '@/lib/utils'
import { CopyableText } from '@/components/ui/copyable-text'
import { checkRole } from '@/lib/auth/utils'

interface PaymentsSuccessProps {
  searchParams: Promise<{ session_id: string }>
}

export default async function PaymentsSuccess({
  searchParams
}: PaymentsSuccessProps) {
  const { session_id: sessionId } = await searchParams
  const session = sessionId ? await retrieveCheckoutSession(sessionId) : null
  const isAdmin = await checkRole('admin')
  const ordersDashboardPath = isAdmin ? '/admin/dashboard/orders' : '/user/dashboard/orders'

  const items = session?.line_items?.data || []
  const totalAmount = session?.amount_total
    ? formatCurrency(session.amount_total / 100)
    : '$0.00'
  const customerEmail = session?.customer_details?.email || ''
  const orderDate = session?.created
    ? new Date(session.created * 1000).toLocaleDateString()
    : ''
  const customerName = session?.customer_details?.name || ''
  const itemCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0)
  console.log('Session:', session)
  // Format shipping address if it exists
  const shippingAddress = session?.shipping_details?.address
  const formattedAddress = shippingAddress
    ? [
        shippingAddress.line1,
        shippingAddress.line2,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.postal_code,
        shippingAddress.country
      ]
        .filter(Boolean)
        .join(', ')
    : null

  return (
    <div className='min-h-screen w-full bg-background overflow-auto py-20'>
      <div className='container mx-auto px-4 flex justify-center'>
        <Card className='w-full max-w-xl shadow-lg my-10'>
          <CardHeader className='text-center pb-6 pt-10 space-y-5'>
            <div className='flex justify-center'>
              <div className='rounded-full bg-green-500/10 p-3.5 ring-3 ring-green-500/20'>
                <CheckCircle2 className='h-10 w-10 text-green-500' />
              </div>
            </div>
            <div className='space-y-1.5'>
              <CardTitle className='text-2xl font-semibold'>
                Payment Successful!
              </CardTitle>
              <CardDescription className='text-base'>
                Thank you for your purchase at BookHeaven
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className='space-y-7 px-5 sm:px-6'>
            <p className='text-muted-foreground text-center text-sm leading-relaxed max-w-md mx-auto'>
              Your order has been processed successfully. You will receive a
              confirmation email shortly with details of your purchase.
            </p>

            {session && (
              <>
                <Separator />

                <div className='space-y-5'>
                  <div>
                    <h3 className='flex items-center gap-2 text-foreground mb-3.5 font-medium text-base'>
                      <Package className='h-4.5 w-4.5 text-amber-500 dark:text-amber-200' />
                      Order Summary
                    </h3>
                    <div className='text-sm space-y-2.5 bg-muted rounded-lg p-3.5 border'>
                      {customerName && (
                        <p className='flex'>
                          <span className='w-26 text-muted-foreground font-medium'>
                            Name:
                          </span>
                          <span className='text-foreground'>{customerName}</span>
                        </p>
                      )}
                      <p className='flex'>
                        <span className='w-26 text-muted-foreground font-medium'>
                          Order Date:
                        </span>
                        <span className='text-foreground'>{orderDate}</span>
                      </p>
                      <p className='flex'>
                        <span className='w-26 text-muted-foreground font-medium'>
                          Email:
                        </span>
                        <span className='text-foreground'>{customerEmail}</span>
                      </p>
                      <p className='flex items-center'>
                        <span className='w-26 text-muted-foreground font-medium'>
                          Order ID:
                        </span>
                        <CopyableText
                          text={session.id}
                          displayText={session.id.substring(0, 20) + '...'}
                          className='font-mono text-xs hover:text-foreground transition-colors'
                        />
                      </p>
                      <p className='flex'>
                        <span className='w-26 text-muted-foreground font-medium'>
                          Items:
                        </span>
                        <span className='text-foreground'>{itemCount}</span>
                      </p>
                      {formattedAddress && (
                        <div className='flex pt-1'>
                          <span className='w-26 text-muted-foreground font-medium flex items-center gap-1.5'>
                            <MapPin className='h-3.5 w-3.5 text-amber-500 dark:text-amber-200' />
                            Shipping:
                          </span>
                          <span className='text-foreground flex-1 leading-relaxed'>
                            {formattedAddress}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div>
                      <h3 className='font-medium text-base text-foreground mb-3.5 flex items-center gap-2'>
                        <Package className='h-4.5 w-4.5 text-amber-500 dark:text-amber-200' />
                        Items Purchased
                      </h3>
                      <ul className='space-y-2.5 bg-muted rounded-lg p-3.5 border'>
                        {items.map((item) => (
                          <li
                            key={item.id}
                            className='flex items-start gap-3.5 group'
                          >
                            <Package className='h-4.5 w-4.5 text-muted-foreground mt-0.5 flex-shrink-0 group-hover:text-amber-500 dark:group-hover:text-amber-200 transition-colors' />
                            <div className='flex-1 min-w-0'>
                              <div className='flex justify-between gap-3.5 text-sm'>
                                <p className='text-foreground truncate'>
                                  {item.description}
                                </p>
                                {item.amount_total && (
                                  <span className='text-foreground flex-shrink-0'>
                                    {formatCurrency(item.amount_total / 100)}
                                  </span>
                                )}
                              </div>
                              {item.quantity && item.quantity > 1 && (
                                <p className='text-xs text-muted-foreground mt-0.5'>
                                  {item.quantity} ×{' '}
                                  {formatCurrency(
                                    (item.amount_total || 0) /
                                      (item.quantity * 100)
                                  )}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className='flex justify-between items-center py-3.5 px-3.5 bg-muted rounded-lg border'>
                    <span className='font-medium text-base text-foreground'>
                      Total
                    </span>
                    <span className='font-semibold text-lg text-foreground'>
                      {totalAmount}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className='flex flex-col gap-2.5 px-5 sm:px-6 pb-7 pt-5'>
            <Button
              asChild
              className='w-full bg-gradient-to-br from-amber-400 to-amber-300 text-black hover:from-amber-300 hover:to-amber-200 h-11 font-medium shadow-lg shadow-amber-500/10 dark:shadow-amber-950/10 transition-all duration-300'
            >
              <Link href='/books'>Continue Exploring Books</Link>
            </Button>
            <Button
              variant='outline'
              asChild
              className='w-full h-11 transition-all duration-300'
            >
              <Link href={ordersDashboardPath}>View My Orders</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
