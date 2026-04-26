import type { Metadata } from 'next'
import Under699Client from './Under699Client'

export const metadata: Metadata = {
  title: 'Shop Under ₹699',
  description: 'Curated fashion picks under ₹699. New styles added daily on MEGG.',
  alternates: { canonical: 'https://meggfashion.in/under699' },
  openGraph: {
    title: 'Shop Under ₹699 — MEGG',
    description: 'Curated fashion picks under ₹699. New styles added daily.',
    url: 'https://meggfashion.in/under699',
  },
}

export default function Under699Page() {
  return <Under699Client />
}
