import Link from 'next/link'
import type { Gender } from '@/lib/api'
import { genderPath } from '@/lib/genderPath'

export default function Under699Banner({ gender }: { gender: Gender }) {
  return (
    <section className="relative isolate overflow-hidden bg-black text-center py-[clamp(3rem,6vw,5rem)]">
      <img
        src="https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/699Banner.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center gap-[1.25rem] px-[var(--container-px)]">
        {/* Eyebrow */}
        <span className="text-label text-gray-400">
          Limited Time
        </span>

        {/* Title */}
        <h2
          className="font-serif text-white uppercase leading-[1.05] text-[clamp(2rem,5vw,3.5rem)] font-normal tracking-[-0.02em]"
          style={{ textShadow: '0 1px 0 #d0d0d0, 0 2px 0 #aaa, 0 3px 0 #777, 0 8px 16px rgb(0 0 0 / 65%)' }}
        >
          Shop Under <span className="normal-case">Rs.</span> 699
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-gray-400 uppercase leading-[1.6] text-[0.8rem] max-w-[340px] tracking-[0.03em]">
          Quality picks that don't break the bank. New styles added daily.
        </p>

        {/* CTA */}
        <Link
          href={genderPath(gender, '/under699')}
          className="inline-flex items-center justify-center bg-white text-black font-sans text-xs tracking-wider uppercase px-10 py-[0.875rem] mt-1 transition-opacity hover:opacity-82 font-medium"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
