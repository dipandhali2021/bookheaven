'use client'

import { OrderStatus } from '@/db/schema/orders.schema'
import { Truck, CheckCircle } from 'lucide-react'
import { UpdateOrderStatusButton } from '@/components/orders/order-status/UpdateOrderStatusButton'

interface OrderCardAdminActionsProps {
  orderId: string
  status: OrderStatus
  inline?: boolean
}

export function OrderCardAdminActions({
  orderId,
  status,
  inline = false
}: OrderCardAdminActionsProps) {
  if (status === 'Created') {
    return (
      <UpdateOrderStatusButton 
        orderId={orderId} 
        currentStatus={status} 
        newStatus="Delivering"
        variant="status"
        label={
          <div className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            <span className="hidden md:inline">Mark as Delivering</span>
          </div>
        } 
      />
    );
  }
  
  if (status === 'Delivering') {
    return (
      <UpdateOrderStatusButton 
        orderId={orderId} 
        currentStatus={status} 
        newStatus="Delivered"
        variant="status"
        label={
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden md:inline">Mark as Delivered</span>
          </div>
        } 
      />
    );
  }
  
  return null;
}