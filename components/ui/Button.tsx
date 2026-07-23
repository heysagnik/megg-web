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

const baseClasses =
  "inline-flex items-center justify-center font-sans text-xs font-medium uppercase tracking-wider cursor-pointer transition";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-black text-white hover:opacity-[0.82]",
  outline:
    "border border-black bg-transparent text-black hover:bg-black hover:text-white",
  ghost:
    "bg-transparent text-black hover:opacity-55",
  underline:
    "bg-transparent text-black underline decoration-1 underline-offset-[3px] hover:opacity-60",
};

/** Per-variant size — block-style variants own the padding; underline does not. */
const blockSizeClasses: Record<ButtonSize, string> = {
  sm: "text-2xs px-[1.375rem] py-2",
  md: "px-[2.25rem] py-[0.875rem]",
  lg: "text-sm px-12 py-[1.125rem]",
};

const underlineSizeClasses: Record<ButtonSize, string> = {
  sm: "text-2xs",
  md: "text-xs",
  lg: "text-sm",
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
  const sizeClasses =
    variant === "underline" ? underlineSizeClasses[size] : blockSizeClasses[size];
  const disabledClasses = disabled ? "opacity-[0.38] pointer-events-none cursor-not-allowed" : "";

  const cls = cn(baseClasses, variantClasses[variant], sizeClasses, disabledClasses, className);

  /* ── Render as Next.js Link when href is supplied ── */
  if (href) {
    return (
      <Link
        href={href}
        className={cls}
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
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
