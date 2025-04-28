import { z } from 'zod'
import { createSearchParamsCache, parseAsString } from 'nuqs/server'

// Define schema for user search parameters
export const userSearchParamsSchema = {
  page: parseAsString.withDefault('1'),
  q: parseAsString.withDefault('')  // Use withDefault('') instead of optional()
}

// Create a cached search params validator
export const userSearchParamsCache = createSearchParamsCache(userSearchParamsSchema)