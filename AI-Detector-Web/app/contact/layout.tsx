import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact DetectX - Get in Touch for AI Detection Solutions & Support',
  description: 'Have questions about AI content detection? Contact DetectX for expert support, partnership inquiries, or learn how our deepfake detection technology can help your organization verify digital content authenticity.',
  openGraph: {
    title: 'Contact DetectX - AI Detection Support & Inquiries',
    description: 'Get in touch with DetectX for AI detection solutions and support.',
  },
  twitter: {
    card: 'summary',
    title: 'Contact DetectX - AI Detection Support',
    description: 'Get in touch with DetectX for AI detection solutions and support.',
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
