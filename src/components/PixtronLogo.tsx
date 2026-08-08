import React from 'react';
import { cn } from '@/lib/utils';

interface PixtronLogoProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'white';
}

export const PixtronLogo: React.FC<PixtronLogoProps> = ({ 
  className, 
  style, 
  variant = 'default' 
}) => {
  const isWhite = variant === 'white';
  const textColor = isWhite ? '#ffffff' : '#003985';
  const topArrowColor = isWhite ? '#ffffff' : '#003985';
  const bottomArrowColor = '#fbbb0d'; // Always Yellow!

  return (
    <div className={cn('inline-flex items-center gap-2 select-none h-11', className)} style={style}>
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-black tracking-tight flex items-center gap-1" style={{ color: textColor }}>
          Pixtron
          {/* Dual Arrow Icon */}
          <svg viewBox="860 40 190 180" className="h-6 w-auto inline-block">
            {/* Bottom Arrow - Yellow */}
            <path
              fill={bottomArrowColor}
              d="M 981.265625 101.882812 L 889.097656 97.789062 C 871.296875 96.996094 868.289062 131.675781 889.382812 132.246094 L 946.734375 133.800781 L 942.351562 191.507812 C 941.019531 209.082031 975.289062 210.9375 976.269531 193.078125 Z M 981.265625 101.882812"
            />
            {/* Top Arrow - White / Blue */}
            <path
              fill={topArrowColor}
              d="M 1035.816406 51.464844 L 943.652344 47.367188 C 925.847656 46.574219 922.84375 81.253906 943.933594 81.824219 L 1001.285156 83.378906 L 996.90625 141.085938 C 995.570312 158.660156 1029.84375 160.515625 1030.824219 142.65625 Z M 1035.816406 51.464844"
            />
          </svg>
        </span>
        <span className="text-xs tracking-widest uppercase font-bold opacity-80" style={{ color: textColor }}>
          Systems
        </span>
      </div>
    </div>
  );
};