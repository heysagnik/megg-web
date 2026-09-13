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

  // `cn` is a plain string-join (no tailwind-merge/dedup) — two conflicting
  // utilities like `pt-xl` and `pt-sm` can both end up in the class list,
  // and whichever Tailwind happens to generate later in the stylesheet
  // wins, regardless of order here. So a caller-supplied pt-/pb- override
  // must fully replace our default instead of sitting alongside it.
  const hasPtOverride = /(^|\s)(pt-|py-)/.test(className ?? '');
  const hasPbOverride = /(^|\s)(pb-|py-)/.test(className ?? '');

  return (
    <Tag
      className={cn(
        !hasPtOverride && 'pt-xl',
        !hasPbOverride && 'pb-xl',
        className,
      )}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
