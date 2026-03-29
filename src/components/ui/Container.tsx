interface ContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Container = ({ children, style }: ContainerProps) => (
  <div style={{
    maxWidth: 'var(--container-max)',
    margin: '0 auto',
    padding: '0 var(--container-px)',
    ...style,
  }}>
    {children}
  </div>
);
