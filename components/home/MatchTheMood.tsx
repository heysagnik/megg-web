
'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Gender } from '@/lib/api'

type Mood = {
  title: string
  subtitle: string
  slug: 'formal' | 'traditional' | 'winter'
  image: string
  alt: string
}

const MOODS: Record<Gender, readonly Mood[]> = {
  men: [
    {
      title: 'Formal',
      subtitle: 'Wear',
      slug: 'formal',
      image: 'https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/moodBanner/formal.webp',
      alt: "Men's formal clothing collection",
    },
    {
      title: 'Traditional',
      subtitle: 'Wear',
      slug: 'traditional',
      image: 'https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/moodBanner/traditional.webp',
      alt: "Men's traditional clothing collection",
    },
    {
      title: 'Winter',
      subtitle: 'Wear',
      slug: 'winter',
      image: 'https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/moodBanner/winter.webp',
      alt: "Men's winter clothing collection",
    },
  ],
  women: [
    {
      title: 'Formal',
      subtitle: 'Wear',
      slug: 'formal',
      image: 'https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/moodBanner/women-formal.webp',
      alt: "Women's formal clothing collection",
    },
    {
      title: 'Traditional',
      subtitle: 'Wear',
      slug: 'traditional',
      image: 'https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/moodBanner/women-traditional.webp',
      alt: "Women's traditional clothing collection",
    },
    {
      title: 'Winter',
      subtitle: 'Wear',
      slug: 'winter',
      image: 'https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/moodBanner/women-winter.webp',
      alt: "Women's winter clothing collection",
    },
  ],
}

function moodHref(gender: Gender, slug: Mood['slug']) {
  return gender === 'women' ? `/women/mood/${slug}` : `/mood/${slug}`
}

export default function MatchTheMood({ gender }: { gender: Gender }) {
  const moods = MOODS[gender]
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function handleScroll() {
    const carousel = carouselRef.current
    if (!carousel) return

    const slideWidth = carousel.clientWidth
    if (slideWidth <= 0) return

    const nextIndex = Math.min(
      moods.length - 1,
      Math.max(0, Math.round(carousel.scrollLeft / slideWidth))
    )

    setActiveIndex((current) =>
      current === nextIndex ? current : nextIndex
    )
  }

  function goToSlide(index: number) {
    const carousel = carouselRef.current
    if (!carousel) return

    carousel.scrollTo({
      left: index * carousel.clientWidth,
      behavior: 'smooth',
    })
  }

  return (
    <section className="mx-auto w-full max-w-[var(--container-max)] px-[var(--container-px)] pt-6 pb-8 sm:pt-8 sm:pb-10 lg:pt-12 lg:pb-14">
      <div className="mb-5 flex justify-center text-center sm:mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500 sm:text-xs">
            Find your style
          </p>
          <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-black sm:text-4xl lg:text-5xl">
            Mood Collections
          </h2>
          <div className="mx-auto mt-3 h-px w-10 bg-black sm:mt-4 sm:w-14" />
        </div>
      </div>

      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-0 overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:gap-4 lg:gap-5"
        aria-label="Shop collections by mood"
      >
        {moods.map((mood) => (
          <article
            key={mood.slug}
            className="group relative isolate aspect-[4/5] w-full min-w-full shrink-0 snap-start overflow-hidden bg-neutral-100 sm:aspect-[3/4] sm:min-w-0"
          >
            <Image
              src={mood.image}
              alt={mood.alt}
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 33vw, 400px"
              className="object-cover transition-transform duration-700 ease-out sm:group-hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-2 pb-4 text-center text-white sm:px-3 sm:pb-6 lg:pb-8">
              <h3 className="whitespace-nowrap font-serif text-[clamp(1.25rem,3vw,2.5rem)] leading-none tracking-normal sm:tracking-wide">
                {mood.title}
              </h3>

              <p className="mt-1 text-[clamp(0.625rem,1.1vw,0.875rem)] uppercase leading-tight tracking-[0.16em] sm:tracking-[0.2em]">
                {mood.subtitle}
              </p>

              <Link
                href={moodHref(gender, mood.slug)}
                className="mt-3 inline-flex min-h-9 items-center justify-center whitespace-nowrap border border-white px-4 py-2 text-[clamp(0.625rem,0.9vw,0.75rem)] leading-none uppercase tracking-[0.1em] transition-colors duration-200 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:mt-4 sm:min-h-10 sm:px-5 sm:tracking-[0.14em] lg:mt-5 lg:min-h-11 lg:px-6"
              >
                Shop now
              </Link>
            </div>


          </article>
        ))}
      </div>

      <div
        className="mt-4 flex items-center justify-center gap-2 sm:hidden"
        role="group"
        aria-label="Choose a mood banner"
      >
        {moods.map((mood, index) => (
          <button
            key={mood.slug}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Show ${mood.title} ${mood.subtitle} banner`}
            aria-current={activeIndex === index ? 'true' : undefined}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? 'w-6 bg-black'
                : 'w-1.5 bg-neutral-300'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
