import React from 'react';
import CTAButton from './CTAButton';

export const UNIFIED_SYSTEM_URL = 'https://3000-i0w99un5bzd0a7a1vp6nc-71ef756c.manus-asia.computer';

interface UnifiedSystemButtonProps {
  href?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
}

const UnifiedSystemButton: React.FC<UnifiedSystemButtonProps> = ({
  href = UNIFIED_SYSTEM_URL,
  label = 'جرّب النظام الموحد',
  icon = '🚀',
  className,
  variant = 'primary',
  fullWidth,
}) => {
  return (
    <CTAButton
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      label={label}
      icon={icon}
      fullWidth={fullWidth}
      className={className}
      variant={variant}
    />
  );
};

export default UnifiedSystemButton;
