import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Container({ children, className, style }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto max-w-[var(--container-max)] px-[var(--container-px)]", className)}
      style={style}
    >
      {children}
    </div>
  );
}

export default Container;
