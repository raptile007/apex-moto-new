"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Phone, Clock, Navigation, ChevronRight, Search, Wrench, ShieldCheck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import L from "leaflet"

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMap } from "react-leaflet"

function MapSync({ selectedShop, shops }: { selectedShop: string | null, shops: any[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (selectedShop) {
      const shop = shops.find(s => s.id === selectedShop)
      if (shop) {
        map.setView([shop.lat, shop.lng], 12, {
          animate: true,
          duration: 1
        })
      }
    }
  }, [selectedShop, shops, map])

  return null
}

export function ShopMap() {
  const { shops } = useStore()
  const [selectedShop, setSelectedShop] = useState<string | null>(null)
  const [bookingShop, setBookingShop] = useState<any | null>(null)
  const [bookingDate, setBookingDate] = useState<Date | undefined>(new Date())
  const [isClient, setIsClient] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setIsClient(true)
    
    // Fix for default marker icon in Next.js
    if (typeof window !== 'undefined') {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {
          setUserLocation({ lat: 19.0760, lng: 72.8777 })
        }
      )
    }
  }, [])

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const filteredShops = useMemo(() => {
    let result = shops.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    if (userLocation) {
      result = [...result].sort((a, b) => 
        getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) -
        getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
      )
    }
    
    return result
  }, [shops, searchQuery, userLocation])

  useEffect(() => {
    if (selectedShop) {
      const element = document.getElementById(`shop-${selectedShop}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [selectedShop])

  return (
    <>
    <section id="mechanics" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-apex-orange/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apex-orange/10 border border-apex-orange/20 text-apex-orange text-[10px] font-black uppercase tracking-widest mb-4">
              <Wrench className="w-3 h-3" />
              Service & Maintenance
            </div>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-white uppercase italic leading-none">
              Mechanical <span className="text-apex-orange">Finder</span>
            </h2>
          </motion.div>
          
          <div className="w-full md:w-96 relative">
            <Input 
              placeholder="Search by city or shop name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white placeholder:text-neutral-500 focus:border-apex-orange/50 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shop List */}
          <div className="lg:col-span-1 space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredShops.map((shop, index) => (
                <motion.div
                  key={shop.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedShop(shop.id)}
                  className={`p-6 rounded-[2rem] cursor-pointer transition-all border ${
                    selectedShop === shop.id 
                      ? "bg-apex-orange/10 border-apex-orange shadow-[0_0_30px_rgba(255,77,0,0.1)]" 
                      : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.07]"
                  }`}
                  id={`shop-${shop.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-white">{shop.name}</h3>
                        <ShieldCheck className="w-4 h-4 text-apex-orange" />
                      </div>
                      <p className="text-sm text-neutral-500 font-medium">{shop.city}</p>
                    </div>
                    {userLocation && (
                      <div className="text-[10px] font-black text-apex-orange bg-apex-orange/10 px-2 py-1 rounded-full border border-apex-orange/20">
                        {getDistance(userLocation.lat, userLocation.lng, shop.lat, shop.lng).toFixed(1)} KM
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 text-xs text-neutral-400">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-apex-orange/50" />
                      <span className="line-clamp-1">{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-white">4.9 <span className="text-neutral-500 font-normal ml-1">(120+ Reviews)</span></span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {shop.services.slice(0, 3).map((service) => (
                      <span 
                        key={service} 
                        className="text-[9px] font-black uppercase tracking-widest text-white/50 bg-white/5 px-2 py-1 rounded-md border border-white/5"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  {selectedShop === shop.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6 pt-6 border-t border-white/5 flex gap-3"
                    >
                      <Button 
                        size="sm"
                        className="flex-1 bg-apex-orange hover:bg-apex-orange/90 text-white rounded-xl h-12 font-bold"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`, "_blank")
                        }}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        DIRECTIONS
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex-1 border-white/10 hover:bg-white/5 text-white rounded-xl h-12 font-bold"
                        onClick={(e) => {
                          e.stopPropagation()
                          setBookingShop(shop)
                        }}
                      >
                        BOOK NOW
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Map Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2 h-[700px] rounded-[3rem] overflow-hidden border border-white/5 relative group"
          >
            <div className="absolute inset-0 bg-apex-orange/5 mix-blend-overlay z-10 pointer-events-none" />
            {isClient && (
              <MapContainer
                center={userLocation || [19.0760, 72.8777]}
                zoom={5}
                style={{ height: "100%", width: "100%", filter: "invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapSync selectedShop={selectedShop} shops={shops} />
                {filteredShops.map((shop) => (
                  <Marker 
                    key={shop.id} 
                    position={[shop.lat, shop.lng]}
                    eventHandlers={{
                      click: () => setSelectedShop(shop.id)
                    }}
                  >
                    <Popup>
                      <div className="p-3 bg-[#0a0a0a] text-white rounded-xl min-w-[200px]">
                        <h3 className="font-bold text-apex-orange">{shop.name}</h3>
                        <p className="text-xs text-neutral-400 mt-1">{shop.address}</p>
                        <p className="text-xs font-bold mt-2">{shop.phone}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
            
            {/* Map UI Overlay */}
            <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-2">
              <div className="bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="text-[10px] font-black text-apex-orange uppercase tracking-[0.2em] mb-1">Active Hubs</div>
                <div className="text-2xl font-display font-black text-white italic">{shops.length}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    
    {/* Booking Modal */}
    <Dialog open={!!bookingShop} onOpenChange={() => setBookingShop(null)}>
      <DialogContent className="max-w-2xl bg-[#0a0a0a] border-white/5 text-white p-0 overflow-hidden rounded-[2rem]">
        <div className="grid md:grid-cols-2">
          {/* Left: Info */}
          <div className="p-8 bg-apex-orange text-white space-y-6">
             <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Service Hub</h3>
                <h2 className="text-3xl font-display font-black italic uppercase leading-tight">{bookingShop?.name}</h2>
             </div>
             
             <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                   <MapPin className="w-5 h-5 opacity-70" />
                   <p className="text-sm font-medium leading-relaxed">{bookingShop?.address}</p>
                </div>
                <div className="flex items-center gap-3">
                   <Clock className="w-5 h-5 opacity-70" />
                   <p className="text-sm font-medium">09:00 AM - 07:00 PM</p>
                </div>
             </div>

             <div className="pt-8">
                <div className="p-4 bg-black/10 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                   <p className="text-sm font-bold flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      SYSTEMS ONLINE
                   </p>
                </div>
             </div>
          </div>

          {/* Right: Selection */}
          <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
             <div className="space-y-4">
                <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">1. SELECT SERVICE</label>
                <Select defaultValue="General Service">
                   <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold">
                      <SelectValue />
                   </SelectTrigger>
                   <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                      <SelectItem value="General Service">General Service</SelectItem>
                      <SelectItem value="Oil Change">Engine Oil & Filter</SelectItem>
                      <SelectItem value="Brake Overhaul">Brake System Tune-up</SelectItem>
                      <SelectItem value="Suspension Setup">Suspension Tuning</SelectItem>
                      <SelectItem value="Tyre Change">Tyre Replacement</SelectItem>
                   </SelectContent>
                </Select>
             </div>

             <div className="space-y-4">
                <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">2. SELECT DATE</label>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                   <Calendar
                      mode="single"
                      selected={bookingDate}
                      onSelect={setBookingDate}
                      className="rounded-md"
                   />
                </div>
             </div>

             <DialogFooter className="pt-4 sm:justify-start">
                <Button 
                   className="w-full h-14 bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter text-base rounded-2xl shadow-[0_0_30px_rgba(255,77,0,0.3)]"
                   onClick={() => {
                      toast.success("Deployment Scheduled!", {
                         description: `Appointment confirmed for ${bookingDate?.toLocaleDateString()} at ${bookingShop?.name}`
                      })
                      setBookingShop(null)
                   }}
                >
                   INITIALIZE SERVICE
                </Button>
             </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

