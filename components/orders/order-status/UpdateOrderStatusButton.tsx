'use client'

import { OrderStatus } from '@/db/schema/orders.schema'
import { Button } from '@/components/ui/button'
import { updateOrderStatus } from '@/app/actions/orders.actions'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

interface UpdateOrderStatusButtonProps {
  orderId: string
  currentStatus: OrderStatus
  newStatus: OrderStatus
  label: ReactNode | string
  variant?: 'default' | 'status'
}

export function UpdateOrderStatusButton({
  orderId,
  currentStatus,
  newStatus,
  label,
  variant = 'default'
}: UpdateOrderStatusButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleUpdateStatus = () => {
    if (currentStatus === newStatus) {
      toast.info(`Order is already in ${newStatus} status`)
      return
    }

    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus)
        toast.success(`Order status updated to ${newStatus}`)
        router.refresh()
      } catch (error) {
        console.error('Failed to update order status:', error)
        toast.error('Failed to update order status')
      }
    })
  }

  const getButtonClass = () => {
    if (variant === 'status') {
      return "bg-yellow-500 hover:bg-yellow-600 text-white border-none"
    }
    return ""
  }

  return (
    <Button 
      onClick={handleUpdateStatus} 
      disabled={isPending} 
      className={`${getButtonClass()} ${currentStatus === newStatus ? "opacity-50" : ""}`}
      variant={variant === 'default' ? "default" : "outline"}
      size={variant === 'status' ? "sm" : "default"}
    >
      {isPending ? 'Updating...' : label}
    </Button>
  )
}