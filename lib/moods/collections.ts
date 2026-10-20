
import type { Gender } from '@/lib/api'

export type MoodSlug = 'formal' | 'traditional' | 'winter'

export interface MoodProductGroup {
  title: string
  category: string
  subcategories?: string[]
}

interface MoodCollection {
  title: string
  groups: MoodProductGroup[]
}

const COLLECTIONS: Record<Gender, Record<MoodSlug, MoodCollection>> = {
  men: {
    formal: {
      title: 'Formal Wear',
      groups: [
        {
          title: 'Formal Shirts',
          category: 'Shirt',
          subcategories: ['Formal Shirt'],
        },
        {
          title: 'Formal Trousers',
          category: 'Jeans',
          subcategories: ['Formal Pants', 'Trouser'],
        },
        {
          title: 'Formal Shoes',
          category: 'Shoes',
          subcategories: ['Formal Shoes'],
        },
        {
          title: 'Tailored Jackets',
          category: 'Jacket',
          subcategories: ['Tailored'],
        },
      ],
    },
    traditional: {
      title: 'Traditional Wear',
      groups: [
        {
          title: 'Traditional Clothing',
          category: 'Traditional',
          subcategories: [
            'Indo-Western',
            'Kurta',
            'Nehru Jacket',
            'Short Kurta',
            'Suits',
            'Pyjama',
            'Ethnic Shoes',
            'Dupatta',
          ],
        },
      ],
    },
    winter: {
      title: 'Winter Wear',
      groups: [
        { title: 'Sweaters', category: 'Sweater' },
        { title: 'Hoodies', category: 'Hoodies' },
        { title: 'Sweatshirts', category: 'Sweatshirt' },
        {
          title: 'Winter Jackets',
          category: 'Jacket',
          subcategories: ['Puffer', 'Overcoat', 'Bomber', 'Leather', 'Varsity'],
        },
        {
          title: 'Thermal Wear',
          category: 'Innerwear',
          subcategories: ['Thermal Wear'],
        },
      ],
    },
  },
  women: {
    formal: {
      title: 'Formal Wear',
      groups: [
        {
          title: 'Formal Shirts',
          category: 'Shirts',
          subcategories: ['Formal'],
        },
        {
          title: 'Formal Trousers',
          category: 'Trousers & Bottoms',
          subcategories: ['Formal Trousers'],
        },
        {
          title: 'Blazers',
          category: 'Jackets',
          subcategories: ['Blazers'],
        },
      ],
    },
    traditional: {
      title: 'Traditional Wear',
      groups: [
        { title: 'Ethnic Clothing', category: 'Kurtas & Ethnic Wear' },
        {
          title: 'Ethnic Footwear',
          category: 'Footwear',
          subcategories: ['Ethnic Footwear'],
        },
      ],
    },
    winter: {
      title: 'Winter Wear',
      groups: [
        { title: 'Sweaters', category: 'Sweaters' },
        { title: 'Hoodies', category: 'Hoodies' },
        { title: 'Sweatshirts', category: 'Sweatshirts' },
        {
          title: 'Winter Jackets',
          category: 'Jackets',
          subcategories: [
            'Puffer Jackets',
            'Bomber Jackets',
            'Leather Jackets',
            'Varsity Jackets',
            'Utility Jackets',
          ],
        },
      ],
    },
  },
}

export function getMoodCollection(
  gender: Gender,
  slug: MoodSlug,
): MoodCollection {
  return COLLECTIONS[gender][slug]
}

export function isMoodSlug(value: string): value is MoodSlug {
  return value === 'formal' || value === 'traditional' || value === 'winter'
}
