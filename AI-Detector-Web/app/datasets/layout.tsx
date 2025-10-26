import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datasets - AI Detection Training Data & Benchmarks | DetectX',
  description: 'Access comprehensive datasets for AI-generated content detection research. Download curated collections of real and synthetic images, videos, and text for training and testing deepfake detection models. Open-source datasets for the research community.',
  openGraph: {
    title: 'Datasets - AI Detection Training Data | DetectX',
    description: 'Access comprehensive datasets for AI content detection research.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Datasets - AI Detection Training Data | DetectX',
    description: 'Access datasets for AI content detection research.',
  },
  alternates: {
    canonical: '/datasets',
  },
}

export default function DatasetsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
