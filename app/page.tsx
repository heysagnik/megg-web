import type { Metadata } from 'next'
import HomeContent, { homeMetadata } from '@/app/_gender/home'

export const revalidate = 600
export const dynamic = 'force-static'

export const metadata: Metadata = homeMetadata('men')

export default function HomePage() {
  return <HomeContent gender="men" />
}
