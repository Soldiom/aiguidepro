import React from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

type SharedProps = {
  label: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  variant?: ButtonVariant;
};

type CTAButtonAsAnchor = SharedProps & {
  as: 'a';
  href: string;
  target?: string;
  rel?: string;
};

type CTAButtonAsButton = SharedProps & {
  as?: 'button';
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

type CTAButtonProps = CTAButtonAsAnchor | CTAButtonAsButton;

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/50',
  secondary: 'bg-slate-800 text-white border border-slate-700 hover:border-emerald-500/60 hover:bg-slate-800/80',
  outline: 'border border-emerald-500/80 text-emerald-300 hover:bg-emerald-500/10',
};

const CTAButton: React.FC<CTAButtonProps> = (props) => {
  const {
    label,
    icon,
    fullWidth = true,
    className,
    variant = 'primary',
  } = props;

  const sharedClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-2xl text-base font-bold tracking-tight',
    'py-3 px-6 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
    'text-center',
    variantStyles[variant],
    fullWidth ? 'w-full' : 'w-auto',
    className
  );

  if (props.as === 'a') {
    const { href, target, rel } = props;
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={sharedClasses}
      >
        <span>{label}</span>
        {icon && <span className="text-xl" aria-hidden="true">{icon}</span>}
      </a>
    );
  }

  const { type = 'button', onClick, disabled } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(sharedClasses, disabled && 'opacity-60 cursor-not-allowed')}
    >
      <span>{label}</span>
      {icon && <span className="text-xl" aria-hidden="true">{icon}</span>}
    </button>
  );
};

export default CTAButton;
