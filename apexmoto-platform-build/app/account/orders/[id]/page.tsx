'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  MapPin,
  CreditCard,
  Copy,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import type { Order, OrderItem } from '@/lib/supabase/types'
import { toast } from 'sonner'

const orderStatuses = [
  { status: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
]

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    const fetchOrder = async () => {
      const supabase = createClient()
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', resolvedParams.id)
        .eq('user_id', user.id)
        .single()

      if (orderError || !orderData) {
        toast.error('Order not found')
        router.push('/account/orders')
        return
      }

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', resolvedParams.id)

      setOrder(orderData as Order)
      setItems(itemsData as OrderItem[] || [])
      setIsLoading(false)
    }

    fetchOrder()
  }, [user, resolvedParams.id, router])

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.order_number)
      toast.success('Order number copied!')
    }
  }

  const getCurrentStatusIndex = () => {
    if (!order) return 0
    return orderStatuses.findIndex(s => s.status === order.status)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-apex-orange" />
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/account/orders" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Order Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-foreground">Order #{order.order_number}</h1>
              <button onClick={copyOrderNumber} className="p-1 hover:bg-white/10 rounded transition-colors">
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl font-semibold text-sm ${
            order.status === 'delivered' 
              ? 'bg-green-500/20 text-green-500' 
              : order.status === 'cancelled'
                ? 'bg-red-500/20 text-red-500'
                : 'bg-apex-orange/20 text-apex-orange'
          }`}>
            {order.status.replace(/_/g, ' ').toUpperCase()}
          </div>
        </div>

        {/* Order Timeline */}
        {order.status !== 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <h2 className="font-semibold text-foreground mb-6">Order Progress</h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-border">
                <div 
                  className="h-full bg-apex-orange transition-all duration-500"
                  style={{ width: `${(getCurrentStatusIndex() / (orderStatuses.length - 1)) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between relative">
                {orderStatuses.map((s, index) => {
                  const isPast = index <= getCurrentStatusIndex()
                  const isCurrent = index === getCurrentStatusIndex()
                  
                  return (
                    <div key={s.status} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                        isPast ? 'bg-apex-orange text-white' : 'bg-secondary text-muted-foreground'
                      } ${isCurrent ? 'ring-4 ring-apex-orange/30' : ''}`}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs mt-2 text-center max-w-[80px] ${
                        isPast ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {order.estimated_delivery && (
              <div className="mt-6 pt-6 border-t border-border flex items-center gap-3">
                <Clock className="w-5 h-5 text-apex-orange" />
                <span className="text-muted-foreground">
                  Estimated Delivery:{' '}
                  <span className="text-foreground font-medium">
                    {new Date(order.estimated_delivery).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </span>
              </div>
            )}

            {order.tracking_number && (
              <div className="mt-4 flex items-center gap-3">
                <Truck className="w-5 h-5 text-apex-orange" />
                <span className="text-muted-foreground">
                  Tracking:{' '}
                  <span className="text-foreground font-mono">{order.tracking_number}</span>
                </span>
              </div>
            )}
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-apex-orange" />
              <h3 className="font-semibold text-foreground">Shipping Address</h3>
            </div>
            <div className="space-y-1 text-muted-foreground">
              <p className="text-foreground font-medium">{order.shipping_address.full_name}</p>
              <p>{order.shipping_address.street}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}</p>
              <p>{order.shipping_address.phone}</p>
            </div>
          </motion.div>

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-apex-orange" />
              <h3 className="font-semibold text-foreground">Payment</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="text-foreground capitalize">{order.payment_method?.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={order.payment_status === 'paid' ? 'text-green-500' : 'text-yellow-500'}>
                  {order.payment_status?.toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h3 className="font-semibold text-foreground mb-4">Order Items</h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
                  {item.product_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{item.product_name}</h4>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  <p className="text-sm text-muted-foreground">Unit Price: ₹{item.unit_price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">₹{item.total_price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">₹{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className={order.shipping_cost === 0 ? 'text-green-500' : 'text-foreground'}>
                {order.shipping_cost === 0 ? 'FREE' : `₹${order.shipping_cost.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (GST)</span>
              <span className="text-foreground">₹{order.tax.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-green-500">-₹{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between pt-4 border-t border-border">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-apex-orange text-lg">₹{order.total.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Link
            href="/#products"
            className="flex-1 py-3.5 px-4 bg-apex-orange text-white font-semibold rounded-xl hover:bg-apex-orange/90 transition-colors text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="flex-1 py-3.5 px-4 glass text-foreground font-semibold rounded-xl hover:bg-white/10 transition-colors text-center"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  )
}
