import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CustomCursor } from '@/components/custom-cursor'
import { ApexAI } from '@/components/apex-ai'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron"
});

export const metadata: Metadata = {
  title: 'ApexMoto | Premium Motorcycle Parts',
  description: 'High-performance motorcycle parts for KTM, Honda, Yamaha, and Bajaj. Engineering excellence for riders who demand the best.',
  keywords: ['motorcycle parts', 'KTM upgrades', 'racing performance', 'custom bikes', 'ApexMoto'],
  generator: 'v0.app',
  openGraph: {
    title: 'ApexMoto | Premium Motorcycle Parts',
    description: 'High-performance tactical racing platform for the modern rider.',
    url: 'https://apexmoto.com',
    siteName: 'ApexMoto',
    images: [
      {
        url: '/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'ApexMoto Platform Overview',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApexMoto | Premium Motorcycle Parts',
    description: 'High-performance motorcycle parts and custom builds.',
    images: ['/hero-bg.jpg'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: "#050505",
}

import { StoreProvider } from '@/lib/store'
import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} dark`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground custom-scrollbar overflow-x-hidden">
        <StoreProvider>
          <CustomCursor />
          <ApexAI />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: "#1a1a1a",
                color: "#fff",
                border: "1px solid rgba(255, 77, 0, 0.2)",
                borderRadius: "16px",
              }
            }}
          />
        </StoreProvider>
      </body>
    </html>
  )
}

