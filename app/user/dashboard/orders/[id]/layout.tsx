import { Separator } from '@/components/ui/separator'

export default function OrderDetailLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='container mx-auto px-4 py-8 mt-16 md:mt-24 max-w-7xl'>
      <main className='flex-1 min-w-0'>{children}</main>
    </div>
  )
}