'use server'

import { db } from '@/db'
import {
  authors,
  bookEditions,
  bookWorks,
  orderItems,
  orders,
  tags,
  workToAuthors,
  workToTags
} from '@/db/schema'
import { OrderStatus } from '@/db/schema/orders.schema'
import {
  and,
  countDistinct,
  eq,
  getTableColumns,
  ilike,
  inArray,
  ne,
  or,
  sql,
  SQL
} from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getAuthenticatedUserId } from './actions.helpers'
import { isSome } from '@/lib/types'
import { checkRole } from '@/lib/auth/utils'
import { auth } from '@clerk/nextjs/server'

// Define the shipping address type structure
export interface ShippingAddressType {
  name?: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export type FetchedOrderRelations = typeof orders.$inferSelect & {
  items: (typeof orderItems.$inferSelect & {
    bookEdition: typeof bookEditions.$inferSelect & {
      work: typeof bookWorks.$inferSelect
    }
  })[];
  shippingAddress: ShippingAddressType;
}

/**
 * Server action to fetch orders with multi-criteria search at the database level
 */
export async function getOrders(
  options: {
    limit: number
    offset: number
    search?: string
    userIds?: string[]
  } = {
    limit: 10,
    offset: 0,
    search: '',
    userIds: []
  }
) {
  const filters: SQL[] = []

  if (options.search) {
    const searchTerms = options.search.trim().split(/\s+/).filter(Boolean)
    const orConditions: SQL[] = searchTerms.map((term) =>
      or(
        ilike(bookWorks.title, `%${term}%`),
        ilike(bookWorks.originalTitle, `%${term}%`),
        ilike(bookWorks.description, `%${term}%`),
        ilike(bookEditions.publisher, `%${term}%`),
        ilike(bookEditions.edition, `%${term}%`),
        ilike(tags.name, `%${term}%`),
        ilike(authors.name, `%${term}%`),
        ilike(orders.userId, `%${term}%`)
      )
    ) as SQL[]
    filters.push(...orConditions)
  }

  if (isSome(options.userIds) && options.userIds.length > 0) {
    filters.push(inArray(orders.userId, options.userIds))
  }

  const getFilteredOrdersQuery = db
    .select({
      ...getTableColumns(orders)
    })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .innerJoin(bookEditions, eq(orderItems.bookEditionId, bookEditions.id))
    .innerJoin(bookWorks, eq(bookEditions.workId, bookWorks.id))
    .leftJoin(workToAuthors, eq(bookWorks.id, workToAuthors.workId))
    .leftJoin(authors, eq(workToAuthors.authorId, authors.id))
    .leftJoin(workToTags, eq(bookWorks.id, workToTags.workId))
    .leftJoin(tags, eq(workToTags.tagId, tags.id))
    .where(and(...filters))
    .as('filteredOrders')

  const getFilteredOrders = db
    .selectDistinct({
      id: getFilteredOrdersQuery.id
    })
    .from(getFilteredOrdersQuery)
  const getTotalCount = db
    .select({
      totalCount: countDistinct(getFilteredOrdersQuery.id)
    })
    .from(getFilteredOrdersQuery)

  const getOrderFinal = db.query.orders.findMany({
    where: (orders, { inArray }) => inArray(orders.id, getFilteredOrders),
    limit: options.limit,
    offset: options.offset,
    with: {
      items: {
        with: {
          bookEdition: {
            with: {
              work: true
            }
          }
        }
      }
    }
  })

  const [finalOrders, [{ totalCount }]] = await Promise.all([getOrderFinal, getTotalCount])

  return {
    orders: finalOrders as FetchedOrderRelations[],
    totalCount,
    pageCount: Math.ceil(Number(totalCount) / options.limit)
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: string) {
  const user = await getAuthenticatedUserId()
  const isAdmin = await checkRole('admin')
  await db.transaction(async (tx) => {
    const order = await tx.query.orders.findFirst({
      where: (orders, { eq, and, ne }) =>
        and(
          eq(orders.id, orderId),
          isAdmin ? undefined : eq(orders.userId, user),
          ne(orders.status, 'Cancelled')
        ),
      with: {
        items: true
      }
    })
    if (!order) {
      throw new Error('Order not found or already cancelled')
    }
    await tx
      .update(orders)
      .set({ status: 'Cancelled' })
      .where(and(eq(orders.id, orderId), eq(orders.userId, user)))
    for (const item of order.items) {
      await tx
        .update(bookEditions)
        .set({
          stockQuantity: sql`${bookEditions.stockQuantity} + ${item.quantity}`
        })
        .where(eq(bookEditions.id, item.bookEditionId))
    }
  })
  revalidatePath('/user/dashboard/orders')
}

/**
 * Get a single order by ID
 * If user is admin, allow access to any order
 * If user is not admin, only allow access to their own orders
 */
export async function getOrderById(orderId: string): Promise<FetchedOrderRelations | null> {
  const user = await getAuthenticatedUserId()
  const isAdmin = await checkRole('admin')
  
  const whereCondition = isAdmin 
    ? eq(orders.id, orderId)
    : and(eq(orders.id, orderId), eq(orders.userId, user))
  
  const order = await db.query.orders.findFirst({
    where: whereCondition,
    with: {
      items: {
        with: {
          bookEdition: {
            with: {
              work: true
            }
          }
        }
      }
    }
  })

  return order as FetchedOrderRelations | null
}

/**
 * Update order status
 * Only admins can update order status
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const user = await getAuthenticatedUserId()
  const isAdmin = await checkRole('admin')
  
  if (!isAdmin) {
    throw new Error('Only administrators can update order status')
  }
  
  await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, orderId))
    
  // Revalidate both admin and user order pages
  revalidatePath('/admin/dashboard/orders')
  revalidatePath('/user/dashboard/orders')
  revalidatePath(`/user/dashboard/orders/${orderId}`)
}

/**
 * Check if the user has purchased a specific book edition
 * This is used to verify purchases for reviews
 */
export async function hasUserPurchasedBook(bookEditionId: string): Promise<boolean> {
  try {
    // Get the current user ID using Clerk's auth
    const { userId } = auth();
    if (!userId) return false;
    
    // Find any orders containing this book edition for this user
    // This query joins order_items with orders to check if the user has ordered this book
    const purchaseRecord = await db.select()
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orderItems.bookEditionId, bookEditionId),
          eq(orders.userId, userId),
          // We're only counting non-cancelled orders
          // Note: not restricting to only Delivered orders so people can review after purchase
          ne(orders.status, 'Cancelled')
        )
      )
      .limit(1);
    
    return purchaseRecord.length > 0;
  } catch (error) {
    console.error('Error checking if user purchased book:', error);
    return false;
  }
}
