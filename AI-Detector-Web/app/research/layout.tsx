import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research & Papers - AI Detection Studies & Scientific Publications | DetectX',
  description: 'Explore cutting-edge research on AI-generated content detection, deepfake identification, and synthetic media analysis. Access peer-reviewed papers, studies, and scientific publications on machine learning approaches to digital content verification.',
  openGraph: {
    title: 'Research & Papers - AI Detection Studies | DetectX',
    description: 'Explore cutting-edge research on AI content detection and deepfake identification.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research & Papers - AI Detection | DetectX',
    description: 'Explore cutting-edge research on AI content detection.',
  },
  alternates: {
    canonical: '/research',
  },
}

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
