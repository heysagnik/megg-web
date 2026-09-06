import type { Metadata } from 'next'
import Under699Content, { under699Metadata } from '@/app/_gender/under699'

export const revalidate = 600
export const dynamic = 'force-static'

export const metadata: Metadata = under699Metadata('women')

export default function WomenUnder699Page() {
  return <Under699Content gender="women" />
}
