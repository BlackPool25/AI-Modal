import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Awareness & Education - Understanding Deepfakes & Synthetic Media | DetectX',
  description: 'Stay informed about AI-generated content, deepfakes, and synthetic media. Learn how to identify AI-manipulated images, videos, and text. Access educational resources to protect yourself from digital misinformation and understand the impact of generative AI.',
  openGraph: {
    title: 'AI Awareness & Education - Understanding Deepfakes | DetectX',
    description: 'Stay informed about AI-generated content and learn to identify deepfakes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Awareness & Education | DetectX',
    description: 'Stay informed about AI-generated content and learn to identify deepfakes.',
  },
  alternates: {
    canonical: '/awareness',
  },
}

export default function AwarenessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
