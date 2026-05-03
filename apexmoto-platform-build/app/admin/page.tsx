"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { 
  Package, 
  MapPin, 
  BarChart3, 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Pencil,
  Phone,
  ArrowLeft,
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  Check,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { type Product, type Shop } from "@/lib/data"
import { toast } from "sonner"

type Tab = "overview" | "products" | "shops"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [searchQuery, setSearchQuery] = useState("")

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: BarChart3 },
    { id: "products" as Tab, label: "Products", icon: Package },
    { id: "shops" as Tab, label: "Shops", icon: MapPin },
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-6">
              <Link href="/">
                <motion.div 
                  whileHover={{ scale: 1.05, x: -2 }} 
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-[10px] font-black tracking-widest uppercase italic">EXIT TO STORE</span>
                </motion.div>
              </Link>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <h1 className="font-display font-black text-xl tracking-tighter uppercase italic hidden sm:block">
                APEX<span className="text-apex-orange">COMMAND</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  type="text"
                  placeholder="SEARCH DATABASE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-12 h-11 bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 focus:border-apex-orange/50 text-[10px] font-black tracking-widest uppercase placeholder:text-neutral-600"
                />
              </div>
              <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-white/5">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 hide-scrollbar">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-display font-black text-[10px] tracking-widest uppercase italic transition-all border ${
                activeTab === tab.id
                  ? "bg-apex-orange border-apex-orange text-white shadow-[0_0_20px_rgba(255,77,0,0.3)]"
                  : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && <OverviewTab key="overview" />}
          {activeTab === "products" && <ProductsTab key="products" searchQuery={searchQuery} />}
          {activeTab === "shops" && <ShopsTab key="shops" searchQuery={searchQuery} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

function OverviewTab() {
  const { products, cart } = useStore()

  const stats = [
    { 
      label: "Total Revenue", 
      value: "$48,352", 
      change: "+12.5%", 
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600"
    },
    { 
      label: "Orders", 
      value: "1,234", 
      change: "+8.2%", 
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600"
    },
    { 
      label: "Customers", 
      value: "5,678", 
      change: "+15.3%", 
      icon: Users,
      color: "bg-purple-100 text-purple-600"
    },
    { 
      label: "Products", 
      value: products.length.toString(), 
      change: "Active", 
      icon: Package,
      color: "bg-amber-100 text-amber-600"
    },
  ]

  const lowStockProducts = products.filter(p => p.stockStatus === "Low Stock" || p.stockStatus === "Backorder")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-1 h-full bg-apex-orange transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-neutral-500 mb-2 uppercase">{stat.label}</p>
                    <p className="text-4xl font-display font-black italic tracking-tighter uppercase">{stat.value}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <TrendingUp className="w-4 h-4 text-apex-orange" />
                      <span className="text-[10px] text-apex-orange font-black italic tracking-widest uppercase">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 text-apex-orange border border-white/5`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="bg-apex-orange/5 border-apex-orange/20">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-apex-orange font-display font-black italic uppercase tracking-tighter">
              <AlertTriangle className="w-6 h-6" />
              CRITICAL STOCK ALERTS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden">
                      <Image src={product.image} alt="" fill className="w-full h-full object-cover opacity-50" />
                    </div>
                    <div>
                      <p className="font-display font-black text-xs italic uppercase tracking-tight">{product.name}</p>
                      <p className="text-[10px] text-neutral-500 font-black tracking-widest uppercase">{product.brand} • {product.category}</p>
                    </div>
                  </div>
                  <Badge className="bg-apex-orange text-white font-black italic text-[10px] tracking-tighter uppercase px-3 py-1">
                    {product.stock} UNITS
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="bg-white/5 border-white/10 overflow-hidden rounded-3xl">
        <CardHeader>
          <CardTitle className="font-display font-black italic uppercase tracking-tighter">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New order placed", detail: "Order #1234 - $249.99", time: "2 min ago" },
              { action: "Stock updated", detail: "Brembo GP4 Caliper", time: "15 min ago" },
              { action: "New customer registered", detail: "john.rider@email.com", time: "1 hour ago" },
              { action: "Product added", detail: "520 O-Ring Chain Gold", time: "3 hours ago" },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
              >
                <div>
                  <p className="font-bold text-sm text-white">{activity.action}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{activity.detail}</p>
                </div>
                <span className="text-[10px] font-black tracking-widest text-neutral-600 uppercase">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ProductsTab({ searchQuery }: { searchQuery: string }) {
  const { products, updateProduct, deleteProduct, addProduct } = useStore()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStockChange = (id: string, newStock: number) => {
    const stockStatus = newStock > 10 ? "In Stock" : newStock > 0 ? "Low Stock" : "Backorder"
    updateProduct(id, { stock: newStock, stockStatus })
    toast.success("Stock updated successfully")
  }

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id)
    setDeleteConfirm(null)
    toast.success("Product deleted")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-black italic uppercase tracking-tighter">Inventory <span className="text-apex-orange">Management</span></h2>
          <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase mt-1">{products.length} ACTIVE SKU UNITS</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => setIsAddingProduct(true)} className="gap-2 bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter px-6 h-12 rounded-2xl shadow-[0_0_20px_rgba(255,77,0,0.3)]">
            <Plus className="w-4 h-4" />
            DEPLOY NEW PRODUCT
          </Button>
        </motion.div>
      </div>

      {/* Products Table */}
      <Card className="bg-white/5 border-white/10 overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">PRODUCT UNIT</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">SPECS</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">VALUATION</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">STOCKLEVEL</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">STATUS</th>
                <th className="text-right p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-white/10">
                          <Image src={product.image} alt="" fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <p className="font-display font-black text-xs italic uppercase tracking-tight">{product.name}</p>
                          <p className="text-[10px] text-neutral-500 font-black tracking-widest uppercase">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-[10px] font-black tracking-widest text-neutral-400 uppercase">{product.category}</td>
                    <td className="p-6 text-sm font-black italic tracking-tighter text-white uppercase">${product.price.toFixed(2)}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={product.stock}
                          onChange={(e) => handleStockChange(product.id, parseInt(e.target.value) || 0)}
                          className="w-20 h-10 bg-white/5 border-white/10 rounded-xl text-center font-black italic text-xs text-white"
                          min={0}
                        />
                        <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-apex-orange" : "bg-red-500"}`}
                            style={{ width: `${Math.min(100, product.stock * 5)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge className={`font-black italic text-[9px] tracking-widest uppercase px-3 py-1 rounded-full ${
                        product.stockStatus === "In Stock" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                        product.stockStatus === "Low Stock" ? "bg-apex-orange/10 text-apex-orange border border-apex-orange/20 shadow-[0_0_10px_rgba(255,77,0,0.1)]" :
                        "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}>
                        {product.stockStatus}
                      </Badge>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/#products">
                          <motion.div
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-white/5 rounded-xl transition-all border border-white/5 hover:border-white/20 group"
                            title="View on Store"
                          >
                             <Search className="w-4 h-4 text-apex-orange" />
                          </motion.div>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setEditingProduct(product)}
                          className="p-3 bg-white/5 rounded-xl transition-all border border-white/5 hover:border-white/20 group"
                          title="Edit Inventory"
                        >
                           <Pencil className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(239,68,68,0.1)" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-3 bg-white/5 rounded-xl transition-all border border-white/5 hover:border-red-500/30 group"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4 text-red-500/70 group-hover:text-red-500 transition-colors" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Product Dialog */}
      <ProductDialog
        product={editingProduct}
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={(product) => {
          updateProduct(product.id, product)
          setEditingProduct(null)
          toast.success("Product updated successfully")
        }}
      />

      {/* Add Product Dialog */}
      <ProductDialog
        open={isAddingProduct}
        onClose={() => setIsAddingProduct(false)}
        onSave={(product) => {
          addProduct({ ...product, id: `product-${Date.now()}` })
          setIsAddingProduct(false)
          toast.success("Product added successfully")
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm bg-[#0a0a0a] border-white/10 text-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-black italic uppercase tracking-tighter">Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-400 font-medium">
            This action cannot be undone. Are you sure you want to delete this unit from the tactical database?
          </p>
          <DialogFooter className="gap-2 pt-4">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="text-neutral-400 hover:text-white">
              ABORT
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteProduct(deleteConfirm!)} className="bg-red-500 hover:bg-red-600 text-white font-black italic uppercase tracking-tighter rounded-xl">
              CONFIRM_DELETE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function ProductDialog({ 
  product, 
  open, 
  onClose, 
  onSave 
}: { 
  product?: Product | null
  open: boolean
  onClose: () => void
  onSave: (product: Product) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<Product>>({})

  // Sync form data with product prop
  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        name: "",
        brand: "KTM",
        category: "Brakes",
        price: 0,
        description: "",
        stock: 0,
        stockStatus: "In Stock",
        image: "/parts/product-brakes.png",
        specs: {}
      })
    }
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate network delay for "better event handling" feedback
    await new Promise(resolve => setTimeout(resolve, 800))
    onSave(formData as Product)
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#0a0a0a] border-white/10 text-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display font-black italic uppercase tracking-tighter text-2xl">
            {product ? "RECONFIGURE" : "INITIALIZE"} <span className="text-apex-orange">UNIT</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">PRODUCT IDENTIFIER</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ENTER PRODUCT NAME"
              className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">MANUFACTURER</label>
              <Select
                value={formData.brand}
                onValueChange={(value) => setFormData({ ...formData, brand: value as Product["brand"] })}
              >
                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl font-bold text-xs uppercase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                  <SelectItem value="KTM">KTM</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Yamaha">Yamaha</SelectItem>
                  <SelectItem value="Bajaj">Bajaj</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">SECTOR</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Product["category"] })}
              >
                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl font-bold text-xs uppercase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                  <SelectItem value="Brakes">Brakes</SelectItem>
                  <SelectItem value="Engine">Engine</SelectItem>
                  <SelectItem value="Drive">Drive</SelectItem>
                  <SelectItem value="Tyres">Tyres</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">VALUATION ($)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                min={0}
                step={0.01}
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">STOCK ALLOCATION</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => {
                  const stock = parseInt(e.target.value) || 0
                  const stockStatus = stock > 10 ? "In Stock" : stock > 0 ? "Low Stock" : "Backorder"
                  setFormData({ ...formData, stock, stockStatus })
                }}
                min={0}
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">SYSTEM DESCRIPTION</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="ENTER TECHNICAL SPECIFICATIONS..."
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-apex-orange/50 font-bold text-xs uppercase resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-neutral-400 hover:text-white">
              ABORT
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter px-8 h-12 rounded-2xl min-w-[140px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                   PROCESSING...
                </div>
              ) : (
                product ? "CONFIRM UPDATE" : "DEPLOY UNIT"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ShopsTab({ searchQuery }: { searchQuery: string }) {
  const { shops, updateShop, deleteShop, addShop } = useStore()
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [isAddingShop, setIsAddingShop] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filteredShops = shops.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteShop = (id: string) => {
    deleteShop(id)
    setDeleteConfirm(null)
    toast.success("Shop deleted")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-black italic uppercase tracking-tighter">Authorized <span className="text-apex-orange">Dealers</span></h2>
          <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase mt-1">{shops.length} DEPLOYED HUB LOCATIONS</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => setIsAddingShop(true)} className="gap-2 bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter px-6 h-12 rounded-2xl shadow-[0_0_20px_rgba(255,77,0,0.3)]">
            <Plus className="w-4 h-4" />
            REGISTER NEW HUB
          </Button>
        </motion.div>
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredShops.map((shop, index) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="bg-white/5 border-white/10 overflow-hidden hover:shadow-[0_0_30px_rgba(255,77,0,0.1)] transition-all group rounded-3xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-black text-lg italic uppercase tracking-tight group-hover:text-apex-orange transition-colors">{shop.name}</h3>
                      <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">{shop.city}</p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingShop(shop)}
                        className="p-3 bg-white/5 rounded-xl transition-all border border-white/5 hover:border-white/20 group"
                        title="Edit Hub"
                      >
                         <Pencil className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(239,68,68,0.1)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteConfirm(shop.id)}
                        className="p-3 bg-white/5 rounded-xl transition-all border border-white/5 hover:border-red-500/30 group"
                        title="Delete Hub"
                      >
                        <Trash2 className="w-4 h-4 text-red-500/70 group-hover:text-red-500 transition-colors" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-4 text-[10px] font-black tracking-widest uppercase text-neutral-400">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-apex-orange" />
                      <span className="truncate">{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-apex-orange" />
                      <span>{shop.phone}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {shop.services.map((service) => (
                      <Badge key={service} className="bg-white/5 border border-white/10 text-neutral-300 text-[8px] font-black tracking-widest uppercase px-3 py-1">
                        {service}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/5 text-[9px] font-black tracking-widest uppercase text-neutral-600">
                    COORD_DATA: {shop.lat.toFixed(4)}, {shop.lng.toFixed(4)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Shop Dialog */}
      <ShopDialog
        shop={editingShop}
        open={!!editingShop}
        onClose={() => setEditingShop(null)}
        onSave={(shop) => {
          updateShop(shop.id, shop)
          setEditingShop(null)
          toast.success("Shop updated successfully")
        }}
      />

      {/* Add Shop Dialog */}
      <ShopDialog
        open={isAddingShop}
        onClose={() => setIsAddingShop(false)}
        onSave={(shop) => {
          addShop({ ...shop, id: `shop-${Date.now()}` })
          setIsAddingShop(false)
          toast.success("Shop added successfully")
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Shop?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-600">
            This action cannot be undone. Are you sure you want to delete this shop location?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteShop(deleteConfirm!)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function ShopDialog({ 
  shop, 
  open, 
  onClose, 
  onSave 
}: { 
  shop?: Shop | null
  open: boolean
  onClose: () => void
  onSave: (shop: Shop) => void
}) {
  const [formData, setFormData] = useState<Partial<Shop>>({
    name: "",
    address: "",
    city: "",
    lat: 19.0760,
    lng: 72.8777,
    phone: "",
    hours: "9:00 AM - 6:00 PM",
    services: []
  })

  const [newService, setNewService] = useState("")

  // Reset form when shop changes
  useEffect(() => {
    if (shop) {
      setFormData(shop)
    } else {
      setFormData({
        name: "",
        address: "",
        city: "",
        lat: 19.0760,
        lng: 72.8777,
        phone: "",
        hours: "9:00 AM - 6:00 PM",
        services: []
      })
    }
  }, [shop, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Shop)
  }

  const addService = () => {
    if (newService.trim()) {
      setFormData({
        ...formData,
        services: [...(formData.services || []), newService.trim()]
      })
      setNewService("")
    }
  }

  const removeService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services?.filter(s => s !== service)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#0a0a0a] border-white/10 text-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display font-black italic uppercase tracking-tighter text-2xl">
            {shop ? "RECONFIGURE" : "ESTABLISH"} <span className="text-apex-orange">HUB</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">HUB NAME</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ENTER HUB NAME"
              className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">CITY</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="CITY"
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">COMMS/PHONE</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XX XXXX XXXX"
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">LOCATION ADDRESS</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="FULL PHYSICAL ADDRESS"
              className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">LAT_DATA</label>
              <Input
                type="number"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                step="0.0001"
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">LNG_DATA</label>
              <Input
                type="number"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                step="0.0001"
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">OPERATING WINDOW</label>
            <Input
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              placeholder="9:00 AM - 6:00 PM"
              className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">SERVICE CAPABILITIES</label>
            <div className="flex gap-2">
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="ADD CAPABILITY"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addService()
                  }
                }}
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
              />
              <Button type="button" onClick={addService} variant="outline" className="h-12 w-12 bg-white/5 border-white/10 rounded-2xl hover:bg-white/10">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.services?.map((service) => (
                <Badge key={service} className="bg-apex-orange/10 text-apex-orange border border-apex-orange/20 text-[8px] font-black tracking-widest uppercase px-3 py-1 rounded-full gap-2">
                  {service}
                  <button
                    type="button"
                    onClick={() => removeService(service)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-neutral-400 hover:text-white">
              ABORT
            </Button>
            <Button type="submit" className="bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter px-8 h-12 rounded-2xl">
              {shop ? "CONFIRM UPDATE" : "ESTABLISH HUB"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
