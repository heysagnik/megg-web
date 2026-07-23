export default function ProductLoading() {
  return (
    <div
      className="flex flex-col bg-white min-h-[100svh] md:flex-row md:items-start"
      aria-hidden="true"
    >
      {/* ── Image side ── */}
      <div className="flex flex-row w-full md:w-1/2">
        <div
          className="w-5 h-[100svh] flex-shrink-0 hidden md:flex flex-col items-center justify-center gap-[5px]"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-[2px] h-8 bg-border-mid flex-shrink-0"
            />
          ))}
        </div>
        <div className="skeleton flex-1 aspect-[3/4] md:aspect-auto md:h-[100svh]" />
      </div>

      {/* ── Info side ── */}
      <div className="w-full flex flex-col p-md px-[var(--container-px)] pb-12 md:w-1/2 md:h-[100svh] md:p-0 md:items-center md:justify-center md:border-l md:border-border">
        <div className="w-full md:w-[72%] md:py-lg">
          {/* Brand */}
          <div className="skeleton h-[0.55rem] w-[32%] mb-[0.75rem]" />

          {/* Name */}
          <div className="skeleton h-[1.4rem] w-[90%] mb-[0.45rem]" />
          <div className="skeleton h-[1.4rem] w-[65%] mb-[1.25rem]" />

          {/* Price */}
          <div className="skeleton h-6 w-[28%] mb-md" />

          <div className="h-md" />

          {/* Accordion rows */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="border-t border-border-mid min-h-12 flex items-center justify-between"
            >
              <div
                className="skeleton h-[0.6rem]"
                style={{ width: i === 0 ? '36%' : i === 1 ? '52%' : '44%' }}
              />
              <div className="skeleton h-[0.6rem] w-[0.6rem]" />
            </div>
          ))}

          <div className="border-t border-border-mid" />

          {/* Buy button */}
          <div className="skeleton w-full h-[3.25rem]" />

          {/* Caption */}
          <div className="skeleton h-[0.5rem] w-[60%] mx-auto mt-[0.75rem]" />
        </div>
      </div>
    </div>
  )
}
