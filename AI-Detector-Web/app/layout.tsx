import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ModeProvider } from '@/components/providers/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BackgroundAnimation } from '@/components/effects/BackgroundAnimation'
import { SmoothScroll } from '@/components/effects/SmoothScroll'
import { PageLoader } from '@/components/animations/PageLoader'
import { ScrollToTop } from '@/components/effects/ScrollToTop'
import { Analytics } from '@/components/analytics/Analytics'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://detectx.ai'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DetectX - AI Content Detection | Identify Deepfakes & Synthetic Media',
    template: '%s | DetectX - AI Content Detection',
  },
  description: 'Detect AI-generated images, videos, and text instantly. DetectX provides accurate analysis to verify digital content authenticity and identify deepfakes.',
  keywords: ['AI detection', 'deepfake detection', 'synthetic media', 'AI-generated content', 'DetectX', 'content verification', 'digital authenticity', 'fake image detection', 'AI text detection', 'deepfake analyzer'],
  authors: [{ name: 'DetectX Team' }],
  creator: 'DetectX',
  publisher: 'DetectX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DetectX',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'DetectX - AI Content Detection | Identify Deepfakes',
    description: 'Detect AI-generated images, videos, and text instantly. Verify digital content authenticity and identify deepfakes with DetectX.',
    siteName: 'DetectX',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'DetectX - AI Content Detection Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DetectX - AI Content Detection | Identify Deepfakes',
    description: 'Detect AI-generated images, videos, and text instantly. Verify digital content authenticity with DetectX.',
    images: [`${siteUrl}/twitter-image.png`],
    creator: '@DetectX',
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
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0EA5E9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DetectX',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Advanced AI-generated content detection platform for identifying deepfakes and synthetic media',
    sameAs: [
      'https://twitter.com/DetectX',
      'https://facebook.com/DetectX',
      'https://linkedin.com/company/detectx',
      'https://instagram.com/detectx',
      'https://youtube.com/@detectx',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'English',
    },
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DetectX',
    url: siteUrl,
    description: 'Detect AI-generated images, videos, and text with cutting-edge technology',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ModeProvider>
          <PageLoader />
          <ScrollToTop />
          <SmoothScroll />
          <BackgroundAnimation />
          <div className="relative z-10">
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </div>
        </ModeProvider>
      </body>
    </html>
  )
}

