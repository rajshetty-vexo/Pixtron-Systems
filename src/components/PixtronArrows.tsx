import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface PixtronArrowsProps {
  className?: string;
  size?: number;
}

export const PixtronArrows: React.FC<PixtronArrowsProps> = ({ className, size = 24 }) => {
  return (
    <div 
      className={cn("relative inline-block", className)} 
      style={{ width: size, height: size }}
    >
      {/* Yellow Corner (Behind/Bottom-Left) */}
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fbbb0d"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute bottom-[10%] left-[10%] w-[65%] h-[65%]"
        initial={{ opacity: 0, x: -4, y: 4 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <path d="M4 12V4H12" />
      </motion.svg>
      
      {/* Blue Corner (Front/Top-Right) */}
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#003985"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute top-[10%] right-[10%] w-[65%] h-[65%]"
        initial={{ opacity: 0, x: -4, y: 4 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <path d="M4 12V4H12" />
      </motion.svg>
    </div>
  );
};
