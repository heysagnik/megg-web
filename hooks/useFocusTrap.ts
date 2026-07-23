'use client'

import { useEffect, useRef } from 'react'

export interface UseFocusTrapOptions {
  /** Whether the trap is active. */
  active: boolean
  /** The root element containing all focusable children. */
  containerRef: React.RefObject<HTMLElement | null>
  /** Optional external handler for Escape (e.g. the parent's onClose). */
  onEscape?: () => void
}

const FOCUSABLE =
  'a[href]:not([tabindex="-1"]),' +
  'button:not([disabled]):not([tabindex="-1"]),' +
  'input:not([disabled]):not([tabindex="-1"]),' +
  'textarea:not([disabled]):not([tabindex="-1"]),' +
  'select:not([disabled]):not([tabindex="-1"]),' +
  '[tabindex]:not([tabindex="-1"])'

/**
 * Trap keyboard focus inside a container while `active` is `true`.
 * Handles Escape (calls `onEscape` when provided), loops Tab/Shift+Tab
 * around the container, and optionally auto-focuses the first focusable child.
 *
 * Mirrors WAI-ARIA 1.2 dialog pattern.
 */
export function useFocusTrap({
  active,
  containerRef,
  onEscape,
}: UseFocusTrapOptions) {
  const lastFocusRef = useRef<HTMLElement | null>(null)

  // Remember the element that had focus before the trap opened.
  useEffect(() => {
    if (active) {
      lastFocusRef.current = document.activeElement as HTMLElement | null
    }
  }, [active])

  // Auto-focus first focusable child once the container is in the DOM.
  useEffect(() => {
    if (!active) return
    const raf = requestAnimationFrame(() => {
      const el = containerRef.current
      if (!el) return
      const first = el.querySelector<HTMLElement>(FOCUSABLE)
      first?.focus()
    })
    return () => cancelAnimationFrame(raf)
  }, [active, containerRef])

  // Return focus to the previously focused element when the trap closes.
  useEffect(() => {
    if (active) return
    const el = lastFocusRef.current
    if (!el) return
    const timer = setTimeout(() => {
      try { el.focus() } catch { /* element may have been removed */ }
    }, 50)
    return () => clearTimeout(timer)
  }, [active])

  // Escape + Tab trap.
  useEffect(() => {
    if (!active) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onEscape?.()
        return
      }
      if (e.key !== 'Tab') return

      const el = containerRef.current
      if (!el) return
      const focusable = Array.from(
        el.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((n) => n.offsetParent !== null)

      if (focusable.length === 0) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [active, containerRef, onEscape])
}

export { FOCUSABLE }