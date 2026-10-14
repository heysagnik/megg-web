import Image from 'next/image'
import Link from 'next/link'
import type { Gender } from '@/lib/api'

type Mood = {
  title: string
  subtitle: string
  query: string
  image: string
  alt: string
}

const MOODS: Record<Gender, readonly Mood[]> = {
  men: [
    { title: 'Formal', subtitle: 'Wear', query: 'formal wear', image: '/assets/match-the-mood/formal.png', alt: 'Man in a charcoal polo and cream tailored trousers' },
    { title: 'Luxury', subtitle: 'Refined', query: 'luxury refined', image: '/assets/match-the-mood/luxury.png', alt: 'Man in a white shirt and pale blue tailored trousers' },
    { title: 'Athleisure', subtitle: 'Fits', query: 'sports', image: '/assets/match-the-mood/athleisure.png', alt: 'Man in a black hoodie and track pants in a locker room' },
  ],
  women: [
    { title: 'Formal', subtitle: 'Wear', query: 'formal wear', image: '/assets/match-the-mood/women-formal.png', alt: 'Woman in a black blazer and cream tailored trousers' },
    { title: 'Luxury', subtitle: 'Refined', query: 'luxury refined', image: '/assets/match-the-mood/women-luxury.png', alt: 'Woman in an ivory blouse and powder-blue tailored trousers' },
    { title: 'Athleisure', subtitle: 'Fits', query: 'sports', image: '/assets/match-the-mood/women-athleisure.png', alt: 'Woman in a charcoal hoodie and joggers in a locker room' },
  ],
}

function moodHref(gender: Gender, query: string) {
  const params = new URLSearchParams({ query })
  params.set('gender', gender)
  return `/search?${params}`
}

export default function MatchTheMood({ gender }: { gender: Gender }) {
  return (
    <section aria-labelledby="match-the-mood-heading" className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[var(--container-max)]">
        <h2 id="match-the-mood-heading" className="px-[var(--container-px)] text-center font-serif text-[clamp(1.8rem,3vw,2.5rem)] leading-none tracking-[-0.03em] text-black">
          Match The Mood
        </h2>

        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--container-px)] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-10 sm:grid sm:grid-cols-3 sm:gap-7 sm:overflow-visible lg:gap-9 [&::-webkit-scrollbar]:hidden">
          {MOODS[gender].map((mood) => (
            <Link
              key={mood.title}
              href={moodHref(gender, mood.query)}
              className="group relative block w-[76vw] max-w-[25rem] shrink-0 snap-start overflow-hidden bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black sm:w-auto sm:max-w-none"
              aria-label={`Shop ${mood.title} ${mood.subtitle}`}
            >
              <Image
                src={mood.image}
                alt={mood.alt}
                width={1122}
                height={1402}
                sizes="(max-width: 639px) 76vw, (max-width: 1023px) 30vw, 384px"
                className="h-auto w-full transition-transform duration-500 motion-reduce:transition-none sm:group-hover:scale-[1.025]"
              />
              <div className="absolute inset-x-0 top-0 p-5 sm:p-6 lg:p-7">
                <p className="font-sans text-[clamp(1.8rem,3.1vw,3.5rem)] font-bold uppercase leading-[0.85] tracking-[-0.065em] text-black/55">
                  {mood.title}
                </p>
                <p className="mt-1 font-sans text-xs font-medium uppercase tracking-[0.08em] text-black/80 sm:text-sm">
                  {mood.subtitle}
                </p>
              </div>
              <span className="absolute inset-x-0 bottom-5 mx-auto w-fit border border-black/70 bg-white/40 px-2 py-0.5 font-sans text-[0.65rem] font-medium uppercase tracking-[-0.02em] text-black backdrop-blur-[2px] transition-colors group-hover:bg-white/70 sm:bottom-6 sm:text-xs">
                Explore now
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
