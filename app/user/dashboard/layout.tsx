"use client"

import { UserDashboardNavigation } from '@/components/user/dashboard/dashboard-navigation/UserDashboardNavigation'
import { Separator } from '@/components/ui/separator'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  
  // Check if we're on an order detail page
  const isOrderDetailPage = pathname.includes('/user/dashboard/orders/') && 
                            pathname !== '/user/dashboard/orders';

  // If we're on an order detail page, render a different layout
  if (isOrderDetailPage) {
    return (
      <div className='container mx-auto px-4 py-8 mt-16 md:mt-24 max-w-7xl'>
        <main className='flex-1 min-w-0'>{children}</main>
      </div>
    );
  }

  // Regular dashboard layout with sidebar
  return (
    <div className='container mx-auto px-4 py-8 mt-16 md:mt-24 max-w-7xl'>
      <h1 className='text-3xl font-bold tracking-tight mb-6'>Account</h1>

      <div className='flex flex-col md:flex-row gap-8'>
        <aside className='md:w-64 shrink-0'>
          <UserDashboardNavigation className='sticky top-24' />
        </aside>

        <Separator className='md:hidden' />

        <div className='md:hidden h-4' />

        <main className='flex-1 min-w-0'>{children}</main>
      </div>
    </div>
  )
}
