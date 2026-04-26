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
      className={cn(className)}
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "0 var(--container-px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Container;
