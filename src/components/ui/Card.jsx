import React from 'react';

/**
 * Standard card container with deep navy aesthetic and subtle border
 */
export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={`bg-[#0B1F3A]/90 border border-[#1E3A5F] rounded-xl p-6 transition-all duration-200 ${
        hoverEffect ? 'hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-950/30 hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
