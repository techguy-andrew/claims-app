"use client";

import React from 'react';
import { Menu } from 'lucide-react';

export interface Library001MenuButtonProps {
  onClick: () => void;
  className?: string;
  'aria-label'?: string;
}

export const Library001MenuButton: React.FC<Library001MenuButtonProps> = ({ 
  onClick, 
  className = '',
  'aria-label': ariaLabel = 'Toggle navigation menu'
}) => {
  return (
    <button
      onClick={onClick}
      className={`fixed top-4 left-4 z-50 p-4 md:p-2.5 bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-gray-200/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/98 active:scale-95 active:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 min-h-[52px] md:min-h-[40px] min-w-[52px] md:min-w-[40px] mobile-touch-feedback ${className}`}
      aria-label={ariaLabel}
    >
      <Menu className="w-6 h-6 md:w-5 md:h-5 text-gray-700" />
    </button>
  );
};

// Export default for convenience
export default Library001MenuButton;