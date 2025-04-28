import { Roles } from '@/types/globals'
import { auth, currentUser } from "@clerk/nextjs/server"

interface PublicMetadata {
  role?: Roles;
}

export const checkRole = async (role: Roles) => {
  // Try to get role from both auth() and currentUser() to ensure we have the most up-to-date data
  const { userId, sessionClaims } = await auth()
  const user = await currentUser()
  
  console.log('User ID:', userId);
  console.log('Session Claims:', sessionClaims);
  console.log('User from currentUser():', user);
  
  // First check if role exists in user metadata (most reliable)
  if (user?.publicMetadata && 'role' in user.publicMetadata) {
    const userRole = user.publicMetadata.role as Roles
    console.log('Role from user publicMetadata:', userRole)
    return userRole === role
  }
  
  // Fallback to session claims if available
  const publicMetadata = sessionClaims?.publicMetadata as PublicMetadata | undefined
  console.log('Public Metadata from sessionClaims:', publicMetadata)
  
  return publicMetadata?.role === role
}