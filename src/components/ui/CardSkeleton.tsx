export const CardSkeleton = () => (
  <div>
    <div className="skeleton" style={{ aspectRatio: '3/4', marginBottom: '0.75rem' }} />
    <div className="skeleton" style={{ height: '10px', width: '100%', marginBottom: '6px', borderRadius: '3px' }} />
    <div className="skeleton" style={{ height: '10px', width: '60%', borderRadius: '3px' }} />
  </div>
);
