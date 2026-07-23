import { cn } from '@/lib/utils';

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return (
      <div
        className={cn('w-full border-t border-border', className)}
        role="separator"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn('flex w-full items-center', className)}
      role="separator"
    >
      <div className="flex-1 border-t border-border self-center" aria-hidden="true" />
      <span
        className={cn(
          'text-label shrink-0 px-sm text-muted',
        )}
      >
        {label}
      </span>
      <div className="flex-1 border-t border-border self-center" aria-hidden="true" />
    </div>
  );
}

export default Divider;
