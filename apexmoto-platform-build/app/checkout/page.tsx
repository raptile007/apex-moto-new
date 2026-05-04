'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  Shield, 
  Check, 
  Loader2,
  MapPin,
  Package
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type ShippingAddress = {
  full_name: string
  street: string
  city: string
  state: string
  zip_code: string
  country: string
  phone: string
}

export default function CheckoutPage() {
  const { user, profile } = useAuth()
  const { cart, cartTotal, clearCart } = useStore()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    full_name: profile?.full_name || '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'India',
    phone: profile?.phone || '',
  })
  const [paymentMethod, setPaymentMethod] = useState('card')

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout')
    }
  }, [user, router])

  useEffect(() => {
    if (profile) {
      setShippingAddress(prev => ({
        ...prev,
        full_name: profile.full_name || prev.full_name,
        phone: profile.phone || prev.phone,
        street: profile.address?.street || prev.street,
        city: profile.address?.city || prev.city,
        state: profile.address?.state || prev.state,
        zip_code: profile.address?.zip_code || prev.zip_code,
      }))
    }
  }, [profile])

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to your cart to checkout.</p>
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-apex-orange text-white font-semibold rounded-xl hover:bg-apex-orange/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const shippingCost = cartTotal > 5000 ? 0 : 299
  const tax = cartTotal * 0.18
  const total = cartTotal + shippingCost + tax

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `APX-${timestamp}-${random}`
  }

  const handleSubmitOrder = async () => {
    if (!user) return
    
    setIsSubmitting(true)
    const supabase = createClient()

    try {
      const orderNumber = generateOrderNumber()
      const estimatedDelivery = new Date()
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'confirmed',
          subtotal: cartTotal,
          tax: tax,
          shipping_cost: shippingCost,
          total: total,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          payment_status: 'paid',
          estimated_delivery: estimatedDelivery.toISOString(),
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Track purchase activity
      for (const item of cart) {
        await supabase.from('user_activity').insert({
          user_id: user.id,
          activity_type: 'purchase',
          product_id: item.id,
          category: item.category,
          metadata: { quantity: item.quantity, price: item.price },
        })
      }

      clearCart()
      toast.success('Order placed successfully!')
      router.push(`/account/orders/${order.id}`)
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, label: 'Shipping' },
    { number: 2, label: 'Payment' },
    { number: 3, label: 'Review' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-apex-orange flex items-center justify-center">
                <span className="font-display font-bold text-white text-lg">A</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">APEXMOTO</span>
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-green-500" />
              Secure Checkout
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center gap-4">
              <button
                onClick={() => s.number < step && setStep(s.number)}
                className={`flex items-center gap-2 ${s.number <= step ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  s.number < step 
                    ? 'bg-green-500 text-white' 
                    : s.number === step 
                      ? 'bg-apex-orange text-white' 
                      : 'bg-secondary text-muted-foreground'
                }`}>
                  {s.number < step ? <Check className="w-5 h-5" /> : s.number}
                </div>
                <span className={`hidden sm:block font-medium ${s.number === step ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-12 h-0.5 ${s.number < step ? 'bg-green-500' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-apex-orange/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-apex-orange" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Shipping Address</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      value={shippingAddress.full_name}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, full_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-apex-orange focus:ring-1 focus:ring-apex-orange outline-none transition-colors text-foreground"
                      placeholder="John Rider"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Street Address</label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-apex-orange focus:ring-1 focus:ring-apex-orange outline-none transition-colors text-foreground"
                      placeholder="123 Racing Lane"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-apex-orange focus:ring-1 focus:ring-apex-orange outline-none transition-colors text-foreground"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">State</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-apex-orange focus:ring-1 focus:ring-apex-orange outline-none transition-colors text-foreground"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={shippingAddress.zip_code}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zip_code: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-apex-orange focus:ring-1 focus:ring-apex-orange outline-none transition-colors text-foreground"
                      placeholder="400001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-apex-orange focus:ring-1 focus:ring-apex-orange outline-none transition-colors text-foreground"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!shippingAddress.full_name || !shippingAddress.street || !shippingAddress.city}
                  className="mt-6 w-full py-3.5 px-4 bg-apex-orange text-white font-semibold rounded-xl hover:bg-apex-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-apex-orange/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-apex-orange" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'upi', label: 'UPI Payment', icon: Shield },
                    { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                        paymentMethod === method.id
                          ? 'border-apex-orange bg-apex-orange/10'
                          : 'border-border bg-secondary hover:border-apex-orange/50'
                      }`}
                    >
                      <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-apex-orange' : 'text-muted-foreground'}`} />
                      <span className={`font-medium ${paymentMethod === method.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {method.label}
                      </span>
                      {paymentMethod === method.id && (
                        <Check className="w-5 h-5 text-apex-orange ml-auto" />
                      )}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-6 p-4 rounded-xl bg-secondary border border-border">
                    <p className="text-sm text-muted-foreground text-center">
                      Card payment will be processed securely. For demo purposes, all payments are simulated.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 px-4 glass text-foreground font-semibold rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3.5 px-4 bg-apex-orange text-white font-semibold rounded-xl hover:bg-apex-orange/90 transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Shipping Summary */}
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Shipping Address</h3>
                    <button onClick={() => setStep(1)} className="text-sm text-apex-orange hover:underline">
                      Edit
                    </button>
                  </div>
                  <p className="text-foreground">{shippingAddress.full_name}</p>
                  <p className="text-muted-foreground">{shippingAddress.street}</p>
                  <p className="text-muted-foreground">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip_code}</p>
                  <p className="text-muted-foreground">{shippingAddress.phone}</p>
                </div>

                {/* Payment Summary */}
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Payment Method</h3>
                    <button onClick={() => setStep(2)} className="text-sm text-apex-orange hover:underline">
                      Edit
                    </button>
                  </div>
                  <p className="text-foreground capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI Payment' : 'Credit / Debit Card'}</p>
                </div>

                {/* Order Items */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Order Items ({cart.length})</h3>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3.5 px-4 glass text-foreground font-semibold rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 px-4 bg-apex-orange text-white font-semibold rounded-xl hover:bg-apex-orange/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Place Order - ₹{total.toLocaleString()}</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-4">Order Summary</h3>
              
              <div className="space-y-3 pb-4 border-b border-border">
                {cart.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-foreground">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
                {cart.length > 3 && (
                  <p className="text-sm text-muted-foreground">+{cart.length - 3} more items</p>
                )}
              </div>

              <div className="space-y-2 py-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-500' : 'text-foreground'}>
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span className="text-foreground">₹{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-lg font-bold text-apex-orange">₹{total.toLocaleString()}</span>
              </div>

              {cartTotal > 5000 && (
                <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500 font-medium">Free Shipping Applied!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
