import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About DetectX - Our Mission to Combat AI-Generated Content & Deepfakes',
  description: 'Learn about DetectX\'s mission to preserve digital authenticity in the age of AI-generated content. Discover our team, values, and commitment to transparent, ethical AI detection technology that protects against deepfakes and synthetic media manipulation.',
  openGraph: {
    title: 'About DetectX - Our Mission to Combat AI-Generated Content',
    description: 'Discover DetectX\'s commitment to digital authenticity and ethical AI detection technology.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About DetectX - Our Mission to Combat AI-Generated Content',
    description: 'Discover DetectX\'s commitment to digital authenticity and ethical AI detection technology.',
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
