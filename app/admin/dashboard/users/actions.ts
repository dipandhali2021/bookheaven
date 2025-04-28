'use server'

import { ensureAdmin } from '@/app/actions/actions.helpers'
import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

/**
 * Get a list of users with optional search functionality
 */
export async function getUsers(params: { query?: string; limit?: number; offset?: number }) {
  await ensureAdmin()
  
  const client = await clerkClient()
  const { query = '', limit = 10, offset = 0 } = params
  
  try {
    // Use Clerk's getUserList to search for users
    const userListParams: Parameters<typeof client.users.getUserList>[0] = {
      limit,
      offset,
      orderBy: '-created_at'
    }
    
    // Only add the query parameter if it's not empty
    if (query) {
      userListParams.query = query
    }
    
    const users = await client.users.getUserList(userListParams)
    const totalCount = users.totalCount || 0
    
    return { 
      users: users.data,
      totalCount,
      pageCount: Math.ceil(totalCount / limit)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}

/**
 * Set user role
 */
export async function setUserRole(formData: FormData): Promise<void> {
  await ensureAdmin()
  
  const userId = formData.get('userId') as string
  const role = formData.get('role') as string
  
  if (!userId || !role) {
    throw new Error('User ID and role are required')
  }
  
  try {
    const client = await clerkClient()
    await client.users.updateUser(userId, {
      publicMetadata: { role }
    })
    
    // Revalidate the users page to show updated data
    revalidatePath('/admin/dashboard/users')
  } catch (error) {
    console.error('Error setting user role:', error)
    throw new Error('Failed to set user role')
  }
}

/**
 * Remove user role
 */
export async function removeUserRole(formData: FormData): Promise<void> {
  await ensureAdmin()
  
  const userId = formData.get('userId') as string
  
  if (!userId) {
    throw new Error('User ID is required')
  }
  
  try {
    const client = await clerkClient()
    await client.users.updateUser(userId, {
      publicMetadata: { role: null }
    })
    
    // Revalidate the users page to show updated data
    revalidatePath('/admin/dashboard/users')
  } catch (error) {
    console.error('Error removing user role:', error)
    throw new Error('Failed to remove user role')
  }
}

/**
 * Delete user
 */
export async function deleteUser(formData: FormData): Promise<void> {
  await ensureAdmin()
  
  const userId = formData.get('userId') as string
  
  if (!userId) {
    throw new Error('User ID is required')
  }
  
  try {
    // Get the current user to ensure we're not deleting ourselves
    const user = await currentUser()
    
    if (!user) {
      throw new Error('Authentication required')
    }
    
    if (userId === user.id) {
      throw new Error('You cannot delete your own account')
    }
    
    const client = await clerkClient()
    await client.users.deleteUser(userId)
    
    // Revalidate the users page to show updated data
    revalidatePath('/admin/dashboard/users')
  } catch (error) {
    console.error('Error deleting user:', error)
    throw new Error('Failed to delete user')
  }
}

/**
 * Get all admin user IDs for filtering purposes
 */
export async function getAdminUserIds(): Promise<string[]> {
  await ensureAdmin()
  
  const client = await clerkClient()
  
  try {
    // Query all users with admin role
    const adminUsers = await client.users.getUserList({
      // We need to get all admin users, so we'll search for the role in metadata
      // This is an approximation as Clerk API has limitations for searching in metadata
      limit: 100 // Assuming there won't be more than 100 admins
    })
    
    // Filter the users to only include those with admin role
    const adminUserIds = adminUsers.data
      .filter(user => user.publicMetadata?.role === 'admin')
      .map(user => user.id)
    
    return adminUserIds
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return []
  }
}