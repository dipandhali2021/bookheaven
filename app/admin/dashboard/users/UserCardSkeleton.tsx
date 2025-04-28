import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function UserCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden border-border/40 bg-card/95">
      <CardHeader className="p-4 pb-0">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="h-20 w-20 rounded-full" />
          
          <div className="mt-3 space-y-2 w-full">
            <Skeleton className="h-5 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
            <Skeleton className="h-6 w-16 rounded-full mx-auto mt-2" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="text-center p-4 pt-2">
        <Skeleton className="h-3 w-16 mx-auto mb-1" />
        <Skeleton className="h-5 w-28 mx-auto rounded" />
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-4 pt-0 gap-2">
        <Skeleton className="h-9 w-full rounded" />
        <Skeleton className="h-9 w-full rounded" />
        <Skeleton className="h-9 w-full rounded" />
      </CardFooter>
    </Card>
  )
}