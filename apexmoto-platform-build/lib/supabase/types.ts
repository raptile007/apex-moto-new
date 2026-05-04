export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  preferred_bike_type: string | null
  bike_model: string | null
  bike_year: number | null
  address: {
    street?: string
    city?: string
    state?: string
    zip_code?: string
    country?: string
  }
  created_at: string
  updated_at: string
}

export type Shop = {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  phone: string | null
  email: string | null
  latitude: number | null
  longitude: number | null
  services: string[]
  working_hours: Record<string, string>
  image_url: string | null
  rating: number
  is_active: boolean
  created_at: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  category: string
  subcategory: string | null
  brand: string | null
  price: number
  original_price: number | null
  stock_quantity: number
  sku: string | null
  images: string[]
  specifications: Record<string, string | number>
  compatible_bikes: string[]
  tags: string[]
  is_featured: boolean
  is_active: boolean
  rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export type Order = {
  id: string
  user_id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled'
  subtotal: number
  tax: number
  shipping_cost: number
  discount: number
  total: number
  shipping_address: {
    full_name: string
    street: string
    city: string
    state: string
    zip_code: string
    country: string
    phone: string
  }
  billing_address: {
    full_name: string
    street: string
    city: string
    state: string
    zip_code: string
    country: string
  } | null
  payment_method: string | null
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  tracking_number: string | null
  carrier: string | null
  estimated_delivery: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string | null
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export type ServiceBooking = {
  id: string
  user_id: string
  shop_id: string
  booking_number: string
  service_type: 'oil_change' | 'tire_replacement' | 'brake_service' | 'full_service' | 'custom'
  bike_details: {
    make: string
    model: string
    year: number
    vin?: string
  }
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes: string | null
  estimated_cost: number | null
  actual_cost: number | null
  created_at: string
  updated_at: string
  shop?: Shop
}

export type StockAlert = {
  id: string
  user_id: string
  product_id: string
  email: string
  is_notified: boolean
  created_at: string
  product?: Product
}

export type UserActivity = {
  id: string
  user_id: string | null
  session_id: string | null
  activity_type: 'view' | 'add_to_cart' | 'purchase' | 'search' | 'wishlist'
  product_id: string | null
  category: string | null
  search_query: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export type WishlistItem = {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export type Review = {
  id: string
  user_id: string
  product_id: string
  rating: number
  title: string | null
  content: string | null
  is_verified_purchase: boolean
  helpful_count: number
  created_at: string
  updated_at: string
  profile?: Profile
}
