'use server'

import { db } from '@/db'
import { BookEdition, BookWork } from '@/db/schema'
import { orders } from '@/db/schema/orders.schema'
import { getProductFromBookEdition } from '@/lib/stripe/books.stripe.metadata'
import { CartDetails } from 'use-shopping-cart/core'
import { validateCartItems } from 'use-shopping-cart/utilities'
import Stripe from 'stripe'
import { env } from '@/env'
import { getAuthenticatedUserId } from './actions.helpers'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

/**
 * Create a checkout session for book editions
 * @param products - CartDetails
 * @returns checkout session id
 */
export const createCheckoutSessionForBookEditions = async (
  products: CartDetails
) => {
  const userId = await getAuthenticatedUserId()

  const ids = Object.keys(products)
  const foundProductsInDb = (await db.query.bookEditions.findMany({
    where: (bookEditions, { inArray }) => inArray(bookEditions.id, ids),
    with: {
      work: true
    }
  })) as (BookEdition & {
    work: BookWork
  })[]
  const inventory = foundProductsInDb.map((product) =>
    getProductFromBookEdition(product, product.work)
  )

  validateCartItemsQuantities(products, foundProductsInDb)
  
  // Check if the total amount meets Stripe's minimum requirement (approximately ₹42)
  const totalAmount = Object.values(products).reduce(
    (sum, item) => sum + item.value * item.quantity,
    0
  );
  
  if (totalAmount < 5000) { // 50 INR in cents (Stripe minimum)
    throw new Error('The minimum order amount is ₹50.00. Please add more items to your cart.');
  }
  
  const line_items = validateCartItems(inventory, products)
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    currency: 'inr',
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'UA', 'GB', 'AU', 'NZ', 'IE', 'ZA', 'RU', 'IN']
    },
    success_url: `${env.NEXT_PUBLIC_APP_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/payments/cancel`,
    metadata: {
      userId
    }
  })

  return checkoutSession.id
}

/**
 * Validate the quantities of the products in the cart against the inventory
 * @param products - CartDetails
 * @param BookEditions - BookEdition[]
 */
const validateCartItemsQuantities = (
  products: CartDetails,
  BookEditions: BookEdition[]
) => {
  for (const product of BookEditions) {
    if (products[product.id].quantity > product.stockQuantity) {
      throw new Error(`Insufficient inventory for product ${product.id}`)
    }
  }
}

export const retrieveCheckoutSession = async (sessionId: string) => {
  if (!sessionId) return null
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product']
    })
    return session
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return null
  }
}

export const updateOrderShippingAddress = async (sessionId: string, shippingAddress: any) => {
  if (!sessionId || !shippingAddress) return null

  try {
    const result = await db
      .update(orders)
      .set({ shippingAddress })
      .where(eq(orders.stripeSessionId, sessionId))
      .returning()
    
    return result[0] || null
  } catch (error) {
    console.error('Error updating order shipping address:', error)
    return null
  }
}
