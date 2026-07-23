import React from 'react';
import { cn } from '@/lib/utils';

type AsProp<T extends React.ElementType> = {
  as?: T;
};

type SectionOwnProps<T extends React.ElementType = 'section'> = AsProp<T> & {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

type SectionProps<T extends React.ElementType = 'section'> = SectionOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof SectionOwnProps<T>>;

export default function Section<T extends React.ElementType = 'section'>({
  as,
  children,
  className,
  style,
  ...rest
}: SectionProps<T>) {
  const Tag = (as ?? 'section') as React.ElementType;

  return (
    <Tag
      className={cn('pt-xl pb-xl', className)}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
