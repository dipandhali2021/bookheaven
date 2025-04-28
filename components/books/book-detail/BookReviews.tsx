import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getReviews,
  hasReviewedBookEdition
} from '@/app/actions/reviews.actions'
import {
  ReviewCard,
  ReviewCardSkeleton
} from '@/components/reviews/review-card/ReviewCard'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { Separator } from '@/components/ui/separator'
import { Protect } from '@clerk/nextjs'
import { hasUserPurchasedBook } from '@/app/actions/orders.actions'
import { AlertCircle, ShoppingCart } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BookReviewsProps {
  editionId: string
}

export default async function BookReviews({ editionId }: BookReviewsProps) {
  const [reviews, hasReviewed, hasPurchased] = await Promise.all([
    getReviews(editionId),
    hasReviewedBookEdition(editionId),
    hasUserPurchasedBook(editionId)
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Protect>
          {hasReviewed ? null : (
            <>
              {hasPurchased ? (
                <ReviewForm editionId={editionId} />
              ) : (
                <Alert variant="destructive" className="bg-muted">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Purchase required</AlertTitle>
                  <AlertDescription className="flex flex-col gap-2">
                    <p>You need to purchase this book to write a review.</p>
                    <Button asChild variant="default" size="sm" className="w-fit">
                      <Link href="#book-actions">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Purchase Book
                      </Link>
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
          <Separator className='my-6' />
        </Protect>

        {reviews.length > 0 && (
          <>
            <div className='space-y-6'>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.review.id}
                  review={review.review}
                  rating={review.rating}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function BookReviewsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='h-40 bg-muted rounded animate-pulse' />
        <Separator className='my-6' />
        <div className='space-y-6'>
          {[1, 2, 3].map((i) => (
            <ReviewCardSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
