'use client'

import { usePathname } from 'next/navigation'
import { parseGender, type Gender } from '@/lib/api'

/**
 * Read the current gender scope from the URL. Men's routes live at the
 * site root (no prefix); women's live under `/women/...`. Any path whose
 * first segment isn't literally `women` (including `/product/[id]`,
 * `/search`, etc.) resolves to `'men'`.
 */
export function useGender(): Gender {
  const pathname = usePathname() ?? '/'
  const first = pathname.split('/')[1]
  return parseGender(first)
}
