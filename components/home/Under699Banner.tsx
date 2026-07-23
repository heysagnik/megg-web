import Link from 'next/link'

export default function Under699Banner() {
  return (
    <section className="bg-black text-center py-[clamp(3rem,6vw,5rem)]">
      <div className="flex flex-col items-center gap-[1.25rem] px-[var(--container-px)]">
        {/* Eyebrow */}
        <span className="font-sans text-xs tracking-widest text-gray-400 uppercase">
          Limited Time
        </span>

        {/* Title */}
        <h2 className="font-serif text-white uppercase leading-[1.05] text-[clamp(2rem,5vw,3.5rem)] font-normal tracking-[-0.02em]">
          Shop Under <span className="normal-case">Rs.</span> 699
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-gray-400 uppercase leading-[1.6] text-[0.8rem] max-w-[340px] tracking-[0.03em]">
          Quality picks that don't break the bank. New styles added daily.
        </p>

        {/* CTA */}
        <Link
          href="/under699"
          className="inline-flex items-center justify-center bg-white text-black font-sans text-xs tracking-wider uppercase px-10 py-[0.875rem] mt-1 transition-opacity hover:opacity-82 font-medium"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
