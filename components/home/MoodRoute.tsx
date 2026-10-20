
'use client'

import { useParams } from 'next/navigation'
import type { Gender } from '@/lib/api'
import MoodCollectionPage from '@/components/home/MoodCollectionPage'
import { isMoodSlug } from '@/lib/moods/collections'

export default function MoodRoute({ gender }: { gender: Gender }) {
  const params = useParams<{ mood: string }>()
  const mood = params.mood

  if (!mood || !isMoodSlug(mood)) {
    return (
      <main className="mx-auto max-w-[var(--container-max)] px-[var(--container-px)] py-16">
        <h1 className="font-serif text-3xl">Collection not found</h1>
        <p className="mt-3 text-sm text-neutral-600">
          This collection does not exist.
        </p>
      </main>
    )
  }

  return <MoodCollectionPage gender={gender} slug={mood} />
}
