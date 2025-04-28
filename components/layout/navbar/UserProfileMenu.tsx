'use client'

import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { LayoutDashboard, User, Settings, LogOut, CreditCard } from 'lucide-react'
import { useClerk } from '@clerk/nextjs'

export function UserProfileMenu() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  
  // Determine dashboard URL based on user role
  const dashboardUrl = user?.publicMetadata?.role === 'admin' 
    ? '/admin/dashboard' 
    : '/user/dashboard';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox:
                  'border border-primary/20 hover:border-primary/50 transition-colors duration-200 scale-90 sm:scale-100 sm:border-2',
                userButtonTrigger:
                  'focus:shadow-md hover:shadow-sm transition-shadow duration-200',
                userButtonPopoverCard: 'hidden',
              }
            }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{user?.fullName || 'User'}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user?.primaryEmailAddress?.emailAddress || ''}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboardUrl} className="flex w-full cursor-pointer items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => openUserProfile()}
          className="flex w-full cursor-pointer items-center"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Manage Account</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => signOut()}
          className="flex cursor-pointer items-center text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}