import { AdminDashboardNavigation } from '@/components/admin/dashboard/dashboard-navigation/AdminDashboardNavigation'
import { Separator } from '@/components/ui/separator'

export default function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='container mx-auto px-2 sm:px-4 py-6 mt-14 md:mt-24 max-w-7xl'>
      <h1 className='text-2xl sm:text-3xl font-bold tracking-tight mb-4 sm:mb-6'>
        Admin Dashboard
      </h1>

      <div className='flex flex-col md:flex-row gap-4 md:gap-8'>
        <aside className='md:w-64 shrink-0'>
          <div className='sticky top-16 md:top-24 pb-4'>
            <AdminDashboardNavigation />
          </div>
        </aside>

        <Separator className='md:hidden my-2' />

        <main className='flex-1 min-w-0'>{children}</main>
      </div>
    </div>
  )
}
