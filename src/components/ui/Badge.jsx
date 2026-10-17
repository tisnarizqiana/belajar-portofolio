import React from 'react';

/**
 * Badge component for tech tags, status markers, and category pills
 */
export const Badge = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: "bg-[#071426] text-slate-300 border border-[#1E3A5F]",
    blue: "bg-blue-950/70 text-sky-300 border border-blue-800/60",
    accent: "bg-sky-500/10 text-sky-400 border border-sky-500/30",
    emerald: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium tracking-wide transition-colors ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
};
