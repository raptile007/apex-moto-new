'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Package, 
  ChevronRight,
  Loader2,
  ShoppingBag
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import type { Order } from '@/lib/supabase/types'
import { Header } from '@/components/header'

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/account/orders')
      return
    }

    const fetchOrders = async () => {
      const supabase = createClient()
      
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setOrders(data as Order[] || [])
      setIsLoading(false)
    }

    fetchOrders()
  }, [user, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-500'
      case 'cancelled':
        return 'bg-red-500/20 text-red-500'
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-blue-500/20 text-blue-500'
      default:
        return 'bg-apex-orange/20 text-apex-orange'
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-apex-orange" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Orders Yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
              <Link
                href="/#products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-apex-orange text-white font-semibold rounded-xl hover:bg-apex-orange/90 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="block glass rounded-2xl p-6 hover:border-apex-orange/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <Package className="w-5 h-5 text-apex-orange" />
                          <h3 className="font-semibold text-foreground">{order.order_number}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {order.shipping_address.city}, {order.shipping_address.state}
                      </div>
                      <div className="text-lg font-bold text-apex-orange">
                        ₹{order.total.toLocaleString()}
                      </div>
                    </div>

                    {order.estimated_delivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                        Estimated delivery:{' '}
                        <span className="text-foreground">
                          {new Date(order.estimated_delivery).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
