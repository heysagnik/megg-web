import { Spinner } from './Spinner';

interface EndOfFeedProps {
  loading: boolean;
  hasMore: boolean;
  count: number;
  message?: string;
}

export const EndOfFeed = ({ loading, hasMore, count, message = "You've seen it all" }: EndOfFeedProps) => (
  <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
    {loading && count > 0 && <Spinner />}
    {!hasMore && count > 0 && (
      <p className="text-label" style={{ color: 'var(--color-muted)' }}>{message}</p>
    )}
  </div>
);
