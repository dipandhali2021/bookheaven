'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, ShieldAlert, ShieldX, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { deleteUser, removeUserRole, setUserRole } from './actions'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTransition } from 'react'

// Create a serializable user type
export interface SerializableUser {
  id: string
  firstName: string | null
  lastName: string | null
  imageUrl: string
  emailAddress: string
  role: string
}

interface UserCardProps {
  user: SerializableUser
  currentUserId: string
}

export function UserCard({ user, currentUserId }: UserCardProps) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unnamed User'
  const initials = fullName.split(' ').map(name => name?.[0] || '').join('').toUpperCase()
  const userRole = user.role || 'user'
  const isCurrentUser = user.id === currentUserId
  const [isPending, startTransition] = useTransition()

  // Handle delete user with confirmation
  const handleDeleteUser = () => {
    if (isCurrentUser) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete user "${fullName}"?`);
    if (!confirmed) return;
    
    const formData = new FormData();
    formData.append('userId', user.id);
    
    startTransition(() => {
      deleteUser(formData);
    });
  };

  return (
    <Card className={cn(
      "group h-full overflow-hidden border-border/40 bg-card/95 transition-all duration-300 hover:border-primary/30 hover:shadow-md relative",
      isCurrentUser && "border-amber-300/50 bg-amber-50/10"
    )}>
      {/* User badge and delete button in top right */}
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        {isCurrentUser && (
          <Badge variant="outline" className="bg-amber-100/50 text-amber-700 border-amber-200">
            You
          </Badge>
        )}
        
        {!isCurrentUser && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-muted/80 hover:bg-red-100 hover:text-red-700 transition-colors"
                  onClick={handleDeleteUser}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete user</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete user</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <CardHeader className="p-4 pb-0">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 border-2 border-background shadow-md">
            <AvatarImage src={user.imageUrl} alt={fullName} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="mt-3 space-y-1">
            <h3 className="font-medium text-base leading-tight">{fullName}</h3>
            <p className="text-sm text-muted-foreground">{user.emailAddress}</p>
            
            <Badge className={cn(
              "mt-2 px-2.5 py-0.5",
              userRole === 'admin' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
              userRole === 'moderator' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
              'bg-green-100 text-green-800 hover:bg-green-200'
            )}>
              {userRole}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="text-center p-4 pt-2">
        <p className="text-xs text-muted-foreground mb-1">User ID</p>
        <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">{user.id.slice(0, 12)}...</code>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-4 pt-0 gap-2">
        <form action={setUserRole} className="flex-1">
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="role" value="admin" />
          <Button 
            variant={userRole === 'admin' ? 'default' : 'outline'} 
            size="sm"
            className="w-full"
            type="submit"
            disabled={userRole === 'admin'}
            title="Make admin"
          >
            <ShieldAlert className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </form>
        
        <form action={removeUserRole} className="flex-1">
          <input type="hidden" name="userId" value={user.id} />
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
            type="submit"
            disabled={!userRole || userRole === 'user'}
            title="Remove role"
          >
            <ShieldX className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}