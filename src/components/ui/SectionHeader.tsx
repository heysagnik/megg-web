import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  cta?: string;
  ctaTo?: string;
}

export const SectionHeader = ({ eyebrow, title, cta, ctaTo }: SectionHeaderProps) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
    <div>
      <p className="text-label" style={{ color: 'var(--color-muted)', marginBottom: '0.5rem' }}>{eyebrow}</p>
      <h2 className="text-section">{title}</h2>
    </div>
    {cta && ctaTo && (
      <Link to={ctaTo} className="btn-outline" style={{ padding: '0.625rem 1.5rem' }}>
        {cta}
      </Link>
    )}
  </div>
);
