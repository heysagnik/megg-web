"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "underline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  /** When true, and href is provided, renders as a Next.js Link */
  asChild?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  underline: "btn-underline",
};

/**
 * Inline style overrides per size.
 * The base CSS classes (.btn-*) set md-sized padding; sm / lg deviate from that.
 */
const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    fontSize: "var(--text-2xs)",
    padding: "0.5rem 1.375rem",
    letterSpacing: "var(--tracking-wider)",
  },
  md: {
    /* intentionally empty — CSS class owns the md defaults */
  },
  lg: {
    fontSize: "var(--text-sm)",
    padding: "1.125rem 3rem",
  },
};

/** underline variant has no block padding — only offset from its text baseline */
const underlineSizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { fontSize: "var(--text-2xs)" },
  md: {},
  lg: { fontSize: "var(--text-sm)" },
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  // asChild is accepted for API compatibility; href drives Link rendering
  onClick,
  disabled,
  type = "button",
  href,
}: ButtonProps) {
  const cls = cn(variantClass[variant], className);

  const inlineStyle: React.CSSProperties =
    variant === "underline" ? underlineSizeStyles[size] : sizeStyles[size];

  const disabledStyle: React.CSSProperties = disabled
    ? { opacity: 0.38, pointerEvents: "none", cursor: "not-allowed" }
    : {};

  const combinedStyle: React.CSSProperties = {
    ...inlineStyle,
    ...disabledStyle,
  };

  /* ── Render as Next.js Link when href is supplied ── */
  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        style={combinedStyle}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </Link>
    );
  }

  /* ── Render as <button> ── */
  return (
    <button
      type={type}
      className={cls}
      style={combinedStyle}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
