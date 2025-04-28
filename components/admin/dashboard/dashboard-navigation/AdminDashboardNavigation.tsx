'use client'

import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookIcon, PackageIcon, UsersIcon, UserIcon } from 'lucide-react'

const adminNavItems = [
  {
    title: 'Overview',
    href: '/admin/dashboard',
    icon: BookIcon
  },
  {
    title: 'User Orders',
    href: '/admin/dashboard/orders',
    icon: PackageIcon
  },
  {
    title: 'Authors',
    href: '/admin/dashboard/authors',
    icon: UsersIcon
  },
  {
    title: 'Books',
    href: '/admin/dashboard/books',
    icon: BookIcon
  },
  {
    title: 'Users',
    href: '/admin/dashboard/users',
    icon: UserIcon
  }
]

export function AdminDashboardNavigation({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'grid grid-cols-3 gap-1.5 md:flex md:flex-col md:space-y-1',
        className
      )}
      {...props}
    >
      {adminNavItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col md:flex-row items-center justify-center md:justify-start',
              'rounded-lg p-2 md:px-3 md:py-2 text-sm font-medium',
              'transition-colors duration-200',
              isActive 
                ? 'bg-primary/20 text-primary' 
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <item.icon className='h-5 w-5 mb-1 md:mb-0 md:mr-2 md:h-4 md:w-4' />
            <span className='text-xs md:text-sm'>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
