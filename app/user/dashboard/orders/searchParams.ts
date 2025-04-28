import { createSearchParamsCache, parseAsString } from 'nuqs/server'

export const orderSearchParamsSchema = {
  page: parseAsString.withDefault('1'),
  q: parseAsString.withDefault(''),
  filter: parseAsString.withDefault('all') // 'all' or 'user'
}

export const orderSearchParamsCache = createSearchParamsCache(
  orderSearchParamsSchema
)
