import React from 'react';

/**
 * Reusable Button component with accessible focus styling and semantic anchor support
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  as: Component = 'button',
  href,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071426] disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5"
  };

  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow-blue-500/25 active:bg-blue-700",
    secondary: "bg-[#0B1F3A] hover:bg-[#132d54] text-sky-300 border border-[#1E3A5F] hover:border-sky-500/50",
    outline: "border border-[#1E3A5F] text-slate-200 hover:text-white hover:border-sky-400 hover:bg-[#0B1F3A]/60",
    ghost: "text-slate-300 hover:text-white hover:bg-[#0B1F3A]/80",
    accent: "bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-md hover:shadow-sky-500/20"
  };

  const combinedStyles = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  if (Component === 'a' || href) {
    const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
    return (
      <a
        href={href}
        className={combinedStyles}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
      </a>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
    </button>
  );
};
