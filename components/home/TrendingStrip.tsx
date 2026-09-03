'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/api'
import { cn } from '@/lib/utils'
import ProductCard from '@/components/product/ProductCard'

interface TrendingStripProps {
  products: Product[]
}

export default function TrendingStrip({ products }: TrendingStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isMouseDown, setIsMouseDown] = useState(false)

  const isDragging = useRef(false)
  const startX = useRef(0)
  const startScrollLeft = useRef(0)
  const hasDragged = useRef(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState, products])

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.75
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    const el = scrollRef.current
    if (!el) return
    isDragging.current = true
    setIsMouseDown(true)
    startX.current = e.pageX - el.offsetLeft
    startScrollLeft.current = el.scrollLeft
    hasDragged.current = false
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const el = scrollRef.current
    if (!el) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    const walk = (x - startX.current) * 1.5
    if (Math.abs(x - startX.current) > 6) {
      hasDragged.current = true
    }
    el.scrollLeft = startScrollLeft.current - walk
  }

  const handleMouseUpOrLeave = () => {
    if (isDragging.current) {
      isDragging.current = false
      setIsMouseDown(false)
    }
  }

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault()
      e.stopPropagation()
      hasDragged.current = false
    }
  }

  if (!products || products.length === 0) return null

  return (
    <section className="pt-8 sm:pt-14 pb-10 sm:pb-14 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-5 sm:mb-8 gap-4">
          <div className="min-w-0">
            <p className="font-sans text-[0.625rem] sm:text-[0.675rem] font-semibold tracking-[0.16em] sm:tracking-[0.2em] uppercase text-neutral-400 mb-1">
              WHAT EVERYONE&apos;S WEARING
            </p>
            <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.03em] sm:tracking-[0.06em] uppercase text-black leading-tight">
              TRENDING NOW
            </h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0 pb-0.5">
            <Link
              href="/products?sort=popular"
              className="font-sans text-[0.65rem] sm:text-xs tracking-wider uppercase text-neutral-500 hover:text-black underline underline-offset-4 decoration-neutral-300 hover:decoration-black transition-colors whitespace-nowrap"
            >
              VIEW ALL
            </Link>

            {/* Desktop Navigation Arrows */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous trending items"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 bg-white hover:border-black text-black disabled:opacity-20 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Next trending items"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 bg-white hover:border-black text-black disabled:opacity-20 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Track — Bleeds cleanly to page edges with container padding */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onClickCapture={handleClickCapture}
          className={cn(
            'flex gap-3 sm:gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory py-1 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 lg:-mx-12 lg:px-12 select-none',
            isMouseDown ? 'scroll-auto cursor-grabbing' : 'scroll-smooth cursor-grab sm:cursor-auto'
          )}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[150px] xs:w-[165px] sm:w-[220px] md:w-[250px] lg:w-[270px] shrink-0 snap-start"
            >
              <ProductCard product={product} fetchPriority="auto" disableSwipe />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
