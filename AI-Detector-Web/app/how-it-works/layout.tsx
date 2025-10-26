import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works - AI Detection Technology Explained | DetectX',
  description: 'Discover how DetectX uses advanced machine learning algorithms to detect AI-generated images, videos, and text. Learn about our detection process, accuracy rates, and the technology behind identifying deepfakes and synthetic media.',
  openGraph: {
    title: 'How It Works - AI Detection Technology Explained | DetectX',
    description: 'Discover how DetectX detects AI-generated content using advanced machine learning.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works - AI Detection Technology | DetectX',
    description: 'Discover how DetectX detects AI-generated content using advanced machine learning.',
  },
  alternates: {
    canonical: '/how-it-works',
  },
}

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
