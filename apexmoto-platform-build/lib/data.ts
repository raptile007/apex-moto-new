export type Product = {
  id: string
  name: string
  brand: "KTM" | "Honda" | "Yamaha" | "Bajaj" | "Royal Enfield" | string
  category: "Brakes" | "Engine" | "Drive" | "Tyres"
  price: number
  originalPrice?: number
  description: string
  image: string
  stock: number
  stockStatus: "In Stock" | "Low Stock" | "Backorder"
  specs: Record<string, string>
}

export type Shop = {
  id: string
  name: string
  address: string
  city: string
  lat: number
  lng: number
  phone: string
  hours: string
  services: string[]
}

export type Bike = {
  id: string
  name: string
  brand: string
  model: string
  year: string
  image: string
  basePrice: number
  compatibleCategories: string[]
}

export const bikes: Bike[] = [
  {
    id: "bike-001",
    name: "KTM Duke 390",
    brand: "KTM",
    model: "Duke 390",
    year: "2024",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800",
    basePrice: 350000,
    compatibleCategories: ["Brakes", "Engine", "Drive", "Tyres"]
  },
  {
    id: "bike-002",
    name: "Royal Enfield Himalayan 450",
    brand: "Royal Enfield",
    model: "Himalayan 450",
    year: "2024",
    image: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=800",
    basePrice: 285000,
    compatibleCategories: ["Brakes", "Engine", "Drive", "Tyres"]
  },
  {
    id: "bike-003",
    name: "Yamaha YZF-R15 V4",
    brand: "Yamaha",
    model: "R15 V4",
    year: "2024",
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800",
    basePrice: 182000,
    compatibleCategories: ["Brakes", "Engine", "Drive", "Tyres"]
  }
]

export const products: Product[] = [
  // Brakes
  {
    id: "brake-001",
    name: "Sintered Brake Pads Pro",
    brand: "KTM",
    category: "Brakes",
    price: 89.99,
    originalPrice: 119.99,
    description: "High-performance sintered brake pads with excellent heat dissipation and extended lifespan. Perfect for aggressive riding.",
    image: "/parts/brake-pads.png",
    stock: 24,
    stockStatus: "In Stock",
    specs: { "Material": "Sintered Metal", "Compatibility": "KTM Duke 390/250", "Weight": "120g" }
  },
  {
    id: "brake-002",
    name: "Brembo GP4 Caliper",
    brand: "Honda",
    category: "Brakes",
    price: 449.99,
    description: "Racing-derived monobloc caliper with radial mount. Uncompromising braking performance.",
    image: "/parts/brembo-caliper.png",
    stock: 8,
    stockStatus: "In Stock",
    specs: { "Pistons": "4-Piston", "Material": "Aluminum Alloy", "Mount": "Radial" }
  },
  {
    id: "brake-003",
    name: "Wave Disc Rotor 320mm",
    brand: "Yamaha",
    category: "Brakes",
    price: 189.99,
    description: "Lightweight wave-pattern rotor for superior heat management and consistent braking feel.",
    image: "/parts/wave-disc.png",
    stock: 3,
    stockStatus: "Low Stock",
    specs: { "Diameter": "320mm", "Thickness": "5mm", "Pattern": "Wave Cut" }
  },
  {
    id: "brake-004",
    name: "Steel Braided Brake Lines",
    brand: "Bajaj",
    category: "Brakes",
    price: 69.99,
    description: "DOT-approved steel braided lines for improved brake feel and reduced line expansion.",
    image: "/parts/brake-pads.png",
    stock: 0,
    stockStatus: "Backorder",
    specs: { "Material": "Stainless Steel", "Length": "Custom Fit", "Certification": "DOT/TUV" }
  },
  // Engine
  {
    id: "engine-001",
    name: "Forged Piston Kit 95mm",
    brand: "KTM",
    category: "Engine",
    price: 329.99,
    description: "Race-spec forged aluminum pistons with low friction coating for maximum power output.",
    image: "/parts/piston-kit.png",
    stock: 12,
    stockStatus: "In Stock",
    specs: { "Bore": "95mm", "Material": "Forged Aluminum", "Compression": "13.5:1" }
  },
  {
    id: "engine-002",
    name: "Complete Gasket Set",
    brand: "Honda",
    category: "Engine",
    price: 149.99,
    description: "OEM-quality gasket set including all seals for a complete engine rebuild.",
    image: "/parts/gasket-set.png",
    stock: 45,
    stockStatus: "In Stock",
    specs: { "Pieces": "42 Components", "Material": "Multi-Layer Steel/Composite", "Fitment": "CBR600RR" }
  },
  {
    id: "engine-003",
    name: "Performance Crankshaft",
    brand: "Yamaha",
    category: "Engine",
    price: 899.99,
    originalPrice: 1099.99,
    description: "Precision-balanced crankshaft for high-RPM performance and reliability.",
    image: "/parts/crankshaft.png",
    stock: 2,
    stockStatus: "Low Stock",
    specs: { "Balance": "Computer Balanced", "Material": "4340 Steel", "Stroke": "Stock" }
  },
  {
    id: "engine-004",
    name: "Titanium Valve Set",
    brand: "Bajaj",
    category: "Engine",
    price: 599.99,
    description: "Lightweight titanium valves for higher rev limits and improved throttle response.",
    image: "/parts/titanium-valves.png",
    stock: 6,
    stockStatus: "In Stock",
    specs: { "Material": "Grade 5 Titanium", "Weight Savings": "45%", "Quantity": "8 Valves" }
  },
  // Drive
  {
    id: "drive-001",
    name: "520 O-Ring Chain Gold",
    brand: "KTM",
    category: "Drive",
    price: 129.99,
    description: "Premium gold O-ring chain with superior tensile strength and corrosion resistance.",
    image: "/parts/gold-chain.png",
    stock: 18,
    stockStatus: "In Stock",
    specs: { "Pitch": "520", "Links": "120", "Type": "O-Ring Sealed" }
  },
  {
    id: "drive-002",
    name: "Steel Sprocket Kit",
    brand: "Honda",
    category: "Drive",
    price: 189.99,
    description: "Front and rear sprocket combo with optimized gearing for street performance.",
    image: "/parts/sprocket-kit.png",
    stock: 4,
    stockStatus: "Low Stock",
    specs: { "Front": "15T", "Rear": "45T", "Material": "Chromoly Steel" }
  },
  {
    id: "drive-003",
    name: "Quick-Change Sprocket Carrier",
    brand: "Yamaha",
    category: "Drive",
    price: 279.99,
    description: "Lightweight carrier allowing tool-free rear sprocket changes at the track.",
    image: "/parts/sprocket-kit.png",
    stock: 7,
    stockStatus: "In Stock",
    specs: { "Material": "7075-T6 Aluminum", "Weight": "890g", "Compatibility": "R1/R6" }
  },
  {
    id: "drive-004",
    name: "525 X-Ring Chain Kit",
    brand: "Bajaj",
    category: "Drive",
    price: 219.99,
    description: "Heavy-duty X-ring chain and sprocket kit for touring and adventure bikes.",
    image: "/parts/gold-chain.png",
    stock: 0,
    stockStatus: "Backorder",
    specs: { "Pitch": "525", "Links": "118", "Sprockets": "16T/42T" }
  },
  // Electronics & Maintenance
  {
    id: "maint-001",
    name: "Fully Synthetic Engine Oil 4T",
    brand: "KTM",
    category: "Engine",
    price: 49.99,
    description: "Ultra-premium 10W-40 synthetic oil for high-performance racing engines.",
    image: "/parts/engine-oil.png",
    stock: 120,
    stockStatus: "In Stock",
    specs: { "Grade": "10W-40", "Volume": "1L", "Type": "Full Synthetic" }
  },
  {
    id: "maint-002",
    name: "Iridium Power Spark Plug",
    brand: "Honda",
    category: "Engine",
    price: 19.99,
    description: "High-performance spark plug with iridium tip for superior ignition and power.",
    image: "/parts/spark-plug.png",
    stock: 85,
    stockStatus: "In Stock",
    specs: { "Material": "Iridium", "Heat Range": "9", "Longevity": "50,000 km" }
  },
  {
    id: "maint-003",
    name: "High-Flow Conical Air Filter",
    brand: "Yamaha",
    category: "Engine",
    price: 79.99,
    description: "Performance air filter with pleated media for maximum airflow and protection.",
    image: "/parts/air-filter.png",
    stock: 32,
    stockStatus: "In Stock",
    specs: { "Media": "Red Pleated Cotton", "Washable": "Yes", "Flange": "60mm" }
  },
  {
    id: "elec-001",
    name: "ApexVision Digital TFT Speedo",
    brand: "KTM",
    category: "Electronics",
    price: 449.99,
    description: "Full-color TFT display with integrated telemetry, lap timer, and Bluetooth connectivity.",
    image: "/parts/speedometer.png",
    stock: 14,
    stockStatus: "In Stock",
    specs: { "Display": "5\" TFT", "Resolution": "800x480", "Features": "GPS, Lap Timer" }
  },
  {
    id: "cool-001",
    name: "Pro-Cool Aluminum Radiator",
    brand: "Bajaj",
    category: "Engine",
    price: 299.99,
    description: "High-efficiency aluminum radiator with increased surface area for maximum cooling.",
    image: "/parts/piston-kit.png", // Temporary placeholder
    stock: 8,
    stockStatus: "In Stock",
    specs: { "Material": "Aluminum", "Core Thickness": "40mm", "Finish": "Black Powder Coat" }
  },
  // Tyres
  {
    id: "tyre-001",
    name: "Dual-Sport Adventure 170/60",
    brand: "KTM",
    category: "Tyres",
    price: 249.99,
    description: "50/50 dual-sport tyre with aggressive target pattern for on and off-road capability.",
    image: "/parts/dual-sport-tyre.png",
    stock: 14,
    stockStatus: "In Stock",
    specs: { "Size": "170/60 R17", "Type": "Dual Sport", "Load Rating": "72W" }
  },
  {
    id: "tyre-002",
    name: "Performance Slick Rear",
    brand: "Honda",
    category: "Tyres",
    price: 379.99,
    description: "Race-compound slick tyre for maximum grip on smooth track surfaces.",
    image: "/parts/dual-sport-tyre.png",
    stock: 5,
    stockStatus: "Low Stock",
    specs: { "Size": "190/55 R17", "Compound": "Soft Race", "Use": "Track Only" }
  },
  {
    id: "tyre-003",
    name: "Sport Touring Front 120/70",
    brand: "Yamaha",
    category: "Tyres",
    price: 199.99,
    description: "Long-lasting sport touring tyre with excellent wet weather performance.",
    image: "/parts/dual-sport-tyre.png",
    stock: 22,
    stockStatus: "In Stock",
    specs: { "Size": "120/70 R17", "Type": "Sport Touring", "Mileage": "12,000+ km" }
  },
  {
    id: "tyre-004",
    name: "Supermoto Street Slick",
    brand: "Bajaj",
    category: "Tyres",
    price: 159.99,
    description: "Street-legal slick-style tyre for supermoto and urban performance riding.",
    image: "/parts/dual-sport-tyre.png",
    stock: 9,
    stockStatus: "In Stock",
    specs: { "Size": "150/60 R17", "Type": "Supermoto", "DOT": "Approved" }
  }
]

export const shops: Shop[] = [
  {
    id: "shop-001",
    name: "ApexMoto Performance Hub",
    address: "123 Racing Boulevard",
    city: "Mumbai",
    lat: 19.0760,
    lng: 72.8777,
    phone: "+91 22 1234 5678",
    hours: "9:00 AM - 8:00 PM",
    services: ["Engine Tuning", "Brake Service", "Tyre Fitting"]
  },
  {
    id: "shop-002",
    name: "ApexMoto Speedworks",
    address: "456 Motor Street",
    city: "Delhi",
    lat: 28.6139,
    lng: 77.2090,
    phone: "+91 11 2345 6789",
    hours: "10:00 AM - 7:00 PM",
    services: ["Full Service", "Parts Installation", "Diagnostics"]
  },
  {
    id: "shop-003",
    name: "ApexMoto Racing Center",
    address: "789 Track Lane",
    city: "Bangalore",
    lat: 12.9716,
    lng: 77.5946,
    phone: "+91 80 3456 7890",
    hours: "8:00 AM - 9:00 PM",
    services: ["Race Prep", "Suspension Setup", "ECU Mapping"]
  },
  {
    id: "shop-004",
    name: "ApexMoto Express",
    address: "321 Highway Road",
    city: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
    phone: "+91 44 4567 8901",
    hours: "9:00 AM - 6:00 PM",
    services: ["Quick Service", "Tyre Change", "Oil Change"]
  },
  {
    id: "shop-005",
    name: "ApexMoto Pro Shop",
    address: "654 Gear Street",
    city: "Pune",
    lat: 18.5204,
    lng: 73.8567,
    phone: "+91 20 5678 9012",
    hours: "10:00 AM - 8:00 PM",
    services: ["Custom Builds", "Parts Sourcing", "Vintage Restoration"]
  },
  {
    id: "shop-006",
    name: "ApexMoto Adventure Base",
    address: "987 Trail Road",
    city: "Hyderabad",
    lat: 17.3850,
    lng: 78.4867,
    phone: "+91 40 6789 0123",
    hours: "9:00 AM - 7:00 PM",
    services: ["Adventure Prep", "Off-Road Setup", "Touring Packages"]
  },
  {
    id: "shop-007",
    name: "ApexMoto Metro",
    address: "147 Urban Plaza",
    city: "Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    phone: "+91 33 7890 1234",
    hours: "10:00 AM - 6:00 PM",
    services: ["Urban Commuter Service", "Battery Service", "Chain & Sprocket"]
  },
  {
    id: "shop-008",
    name: "ApexMoto Coastal",
    address: "258 Beach Road",
    city: "Goa",
    lat: 15.2993,
    lng: 74.1240,
    phone: "+91 832 890 1234",
    hours: "9:00 AM - 5:00 PM",
    services: ["Rust Prevention", "Marine Grade Service", "Rental Fleet Maintenance"]
  }
]

export type CartItem = Product & { quantity: number }
