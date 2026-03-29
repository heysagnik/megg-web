import { Link } from 'react-router-dom';
import { Container } from './Container';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  crumbs: Crumb[];
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Slot rendered below title — used for filter tabs */
  below?: React.ReactNode;
}

export const PageHeader = ({ crumbs, title, subtitle, below }: PageHeaderProps) => (
  <div style={{ borderBottom: '1px solid var(--color-border)', padding: 'var(--space-xl) 0 0' }}>
    <Container>
      <p className="text-label" style={{ color: 'var(--color-muted)', marginBottom: '0.6rem' }}>
        {crumbs.map((c, i) => (
          <span key={i}>
            {i > 0 && ' / '}
            {c.to
              ? <Link to={c.to} style={{ opacity: 0.55, transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.55')}
                >{c.label}</Link>
              : c.label}
          </span>
        ))}
      </p>
      <h1 className="text-section" style={{ marginBottom: subtitle ? '0.5rem' : '2rem' }}>{title}</h1>
      {subtitle && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', marginBottom: '2rem' }}>
          {subtitle}
        </p>
      )}
      {below}
    </Container>
  </div>
);
