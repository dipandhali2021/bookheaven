import { BookEdition, BookWork } from '@/db/schema'
import { Product } from 'use-shopping-cart/core'

export const convertToCents = (price: string) => {
  return Math.round(Number(price) * 100)
}

export const convertToDollars = (price: number) => {
  return price / 100
}

export function getProductFromBookEdition(
  bookEdition: BookEdition,
  bookWork: BookWork
): Product {
  // Ensure we have a non-empty description for Stripe
  const description = bookWork.description || `${bookWork.title} - ${bookEdition.format} edition`
  
  // Check if book is on sale and use the sale price if available
  
  
  // Use sale price if on sale, otherwise use regular price
  const priceToUse = bookEdition.isOnSale ? bookEdition.salePrice! : bookEdition.price

  console.log("priceToUse", priceToUse)

  console.log("bookEdition.salePrice", bookEdition.salePrice)
  
  return {
    id: bookEdition.id,
    price_id: bookEdition.id,
    sku: bookEdition.id,
    name: bookWork.title,
    price: convertToCents(priceToUse),
    currency: 'INR',
    image: bookEdition.thumbnailUrl!,
    description: description,
    product_data: {
      name: bookWork.title,
      description: description,
      metadata: {
        // Extra
        dbId: bookEdition.id,
        format: bookEdition.format,
        language: bookEdition.language,
        isbn: bookEdition.isbn,
        publisher: bookEdition.publisher,
        publicationYear: bookWork.writingCompletedAt?.getFullYear()
      }
    }
  }
}
