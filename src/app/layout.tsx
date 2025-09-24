import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "PropFirm Copier - Professional Copy Trading Platform",
    template: "%s | PropFirm Copier"
  },
  description: "Advanced copy trading platform for forex propfirm accounts with risk management, trade journaling, and real-time analytics. Supports FTMO, 5%ers, and more.",
  keywords: [
    "propfirm copy trading",
    "forex copy trading",
    "FTMO copy trading",
    "5%ers copy trading",
    "MetaTrader copy trading",
    "cTrader copy trading",
    "forex risk management",
    "trade journaling",
    "propfirm trading tools"
  ],
  authors: [{ name: "PropFirm Copier Team" }],
  creator: "PropFirm Copier",
  publisher: "PropFirm Copier",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://propfirmcopier.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://propfirmcopier.com',
    title: 'PropFirm Copier - Professional Copy Trading Platform',
    description: 'Advanced copy trading platform for forex propfirm accounts with risk management and journaling tools.',
    siteName: 'PropFirm Copier',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PropFirm Copier Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropFirm Copier - Professional Copy Trading Platform',
    description: 'Advanced copy trading platform for forex propfirm accounts with risk management and journaling tools.',
    images: ['/og-image.png'],
    creator: '@propfirmcopier',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
