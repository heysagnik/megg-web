import Link from 'next/link'
import type { Gender } from '@/lib/api'
import { genderPath } from '@/lib/genderPath'

export default function Under699Banner({ gender }: { gender: Gender }) {
  return (
    <section className="relative isolate overflow-hidden bg-black text-center py-[clamp(3rem,6vw,5rem)] max-md:mx-[var(--container-px)] max-md:h-[220px] max-md:rounded-xl max-md:py-0 max-md:text-left">
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet="/images/under699-mobile-banner.png"
        />
        <img
          src="https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/699Banner.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center max-md:object-[center_55%]"
        />
      </picture>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 max-md:hidden"
      />
      <div className="relative z-10 flex flex-col items-center gap-[1.25rem] px-[var(--container-px)] max-md:h-full max-md:items-start max-md:justify-center max-md:gap-1.5 max-md:px-4">
        {/* Eyebrow */}
        <span className="text-label hidden sm:block text-gray-400 max-md:text-gray-300 max-md:text-[9px] max-md:tracking-[0.22em]">
          Limited Time
        </span>

        {/* Title */}
        <h2
          className="font-serif text-white uppercase leading-[1.05] text-[clamp(2rem,5vw,3.5rem)] font-normal tracking-[-0.02em] max-md:max-w-[52%] max-md:text-[25px] max-md:leading-[1.02] max-md:tracking-[-0.02em]"
          style={{
            textShadow: '0 2px 8px rgb(0 0 0 / 35%)'
          }}
        >
          Shop Under <span className="normal-case">Rs.</span> 699
        </h2>

        {/* Subtitle */}
        <p className="font-sans hidden sm:block text-gray-400 uppercase leading-[1.6] text-[0.8rem] max-w-[340px] tracking-[0.03em] max-md:max-w-[45%] max-md:text-gray-300 max-md:text-[8px] max-md:leading-[1.5] max-md:tracking-[0.08em]">
          Quality picks that don't break the bank. New styles added daily.
        </p>
        {/* CTA */}
        <Link
          href={genderPath(gender, '/under699')}
          className="inline-flex items-center justify-center bg-white text-black font-sans text-xs tracking-wider uppercase px-10 py-[0.875rem] mt-1 transition-opacity hover:opacity-82 font-medium max-md:mt-1 max-md:px-4 max-md:py-2 max-md:text-[9px]"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
