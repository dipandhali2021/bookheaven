'use client'

import { Button } from '@/components/ui/button'
import { LayoutDashboard } from 'lucide-react'
import { NavLink } from './NavLink'
import { useUser } from '@clerk/nextjs'

export function NavbarDashboard() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';
  const dashboardPath = isAdmin ? '/admin/dashboard' : '/user/dashboard';

  return (
    <NavLink
      href={dashboardPath}
      extraActiveClass='text-primary bg-primary/30 rounded-md'
    >
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 sm:h-auto sm:w-auto sm:size-sm relative flex items-center justify-center'
        aria-label='Dashboard'
      >
        <LayoutDashboard className='h-3.5 w-3.5 sm:h-8 sm:w-8' />
      </Button>
    </NavLink>
  )
}
