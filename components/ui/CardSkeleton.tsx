import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  className?: string;
  aspectClass?: string;
}

export default function CardSkeleton({ className, aspectClass = "aspect-[3/4]" }: CardSkeletonProps) {
  return (
    <div className={cn("flex w-full flex-col", className)}>
      {/* Image area shimmer */}
      <div
        className={cn("skeleton w-full", aspectClass)}
        aria-hidden="true"
      />

      {/* Text lines */}
      <div className="flex flex-col gap-[0.35rem] pt-[0.35rem]" aria-hidden="true">
        <div className="skeleton h-[0.5rem] w-[40%]" />
        <div className="skeleton h-[0.5rem] w-[70%]" />
        <div className="skeleton h-[0.5rem] w-[30%] mt-[0.15rem]" />
      </div>
    </div>
  );
}
