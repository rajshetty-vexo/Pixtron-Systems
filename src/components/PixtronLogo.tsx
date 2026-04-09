import React from 'react';
import { cn } from '@/src/lib/utils';
import pixtronLogo from '../assets/pixtron-logo.svg';

interface PixtronLogoProps {
  className?: string;
}

export const PixtronLogo: React.FC<PixtronLogoProps> = ({ className }) => {
  return (
    <img
      src={pixtronLogo}
      alt="Pixtron Systems"
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      className={cn('h-11 w-auto object-contain select-none pointer-events-auto', className)}
    />
  );
};
