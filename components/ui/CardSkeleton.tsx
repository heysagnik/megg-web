import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  className?: string;
}

const styles: Record<string, CSSProperties> = {
  card: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  imageWrap: {
    width: "100%",
    aspectRatio: "3 / 4",
  },
  meta: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    paddingTop: "0.35rem",
  },
  lineBrand: {
    height: "0.5rem",
    width: "40%",
  },
  lineName: {
    height: "0.5rem",
    width: "70%",
  },
  linePrice: {
    height: "0.5rem",
    width: "30%",
    marginTop: "0.15rem",
  },
};

export default function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div style={styles.card} className={cn(className)}>
      {/* Image area — 3/4 aspect ratio shimmer */}
      <div className="skeleton" style={styles.imageWrap} aria-hidden="true" />

      {/* Text lines */}
      <div style={styles.meta} aria-hidden="true">
        {/* Brand */}
        <div className="skeleton" style={styles.lineBrand} />
        {/* Product name */}
        <div className="skeleton" style={styles.lineName} />
        {/* Price */}
        <div className="skeleton" style={styles.linePrice} />
      </div>
    </div>
  );
}
