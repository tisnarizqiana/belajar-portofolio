import React from 'react';

/**
 * Standardized Section Heading with consistent spacing, pill tag, and high-contrast typography
 */
export const SectionHeading = ({
  tag,
  title,
  subtitle,
  centered = true,
  className = ''
}) => {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center' : 'text-left'} ${className}`}>
      {tag && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-950/70 border border-blue-800/60 text-sky-400 mb-3 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
          <span>{tag}</span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
