import { Container } from './Container';

interface SectionProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Section = ({ children, style }: SectionProps) => (
  <section style={{ padding: 'var(--space-2xl) 0', ...style }}>
    <Container>{children}</Container>
  </section>
);
