import React from 'react';
import { cn } from '../../utils/cn';

type SectionDirection = 'rtl' | 'ltr';

interface SectionContainerProps {
  id?: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  direction?: SectionDirection;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  id,
  as: Component = 'section',
  className,
  contentClassName,
  children,
  direction = 'rtl',
}) => {
  return (
    <Component
      id={id}
      dir={direction}
      className={cn(
        'w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16',
        'bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900',
        className
      )}
    >
      <div className={cn('mx-auto w-full max-w-6xl space-y-8', contentClassName)}>
        {children}
      </div>
    </Component>
  );
};

export default SectionContainer;
