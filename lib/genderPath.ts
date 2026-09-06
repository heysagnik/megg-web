import type { Gender } from '@/lib/api'

/**
 * Prefix a root-relative path with the gender segment.
 * Men's routes live at the site root (no prefix); women's live under `/women`.
 */
export function genderPath(gender: Gender, path: string = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  const normalized = clean === '/' ? '' : clean
  return gender === 'women' ? `/women${normalized}` : (normalized || '/')
}

export function otherGender(gender: Gender): Gender {
  return gender === 'men' ? 'women' : 'men'
}
