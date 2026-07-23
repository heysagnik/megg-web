import { Spinner } from './Spinner';
import { cn } from '@/lib/utils';

interface EndOfFeedProps {
  loading: boolean;
  hasMore: boolean;
  count: number;
  message?: string;
  className?: string;
}

export function EndOfFeed({
  loading,
  hasMore,
  count,
  message = 'You\'ve seen everything',
  className,
}: EndOfFeedProps) {
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center py-xl', className)}>
        <Spinner size="md" />
      </div>
    );
  }

  if (!hasMore && count > 0) {
    return (
      <div className={cn('flex items-center gap-md py-xl', className)}>
        <div className="flex-1 h-px bg-border" aria-hidden="true" />
        <span className="text-label text-muted whitespace-nowrap">{message}</span>
        <div className="flex-1 h-px bg-border" aria-hidden="true" />
      </div>
    );
  }

  return null;
}

export default EndOfFeed;
