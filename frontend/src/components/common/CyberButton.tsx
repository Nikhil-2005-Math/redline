import React from 'react';
import { Loader2 } from 'lucide-react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-heading font-semibold uppercase tracking-wider transition-all duration-200 rounded-lg select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#FF3038] text-white hover:bg-[#FF454D] active:bg-[#C81020] shadow-[0_0_15px_rgba(255,48,56,0.45)] hover:shadow-[0_0_25px_rgba(255,48,56,0.7)] border border-[#FF5555]',
    secondary:
      'bg-[#101014] text-[#F5F5F5] hover:bg-[#181820] border border-[#FF3038]/40 hover:border-[#FF3038] shadow-[0_0_10px_rgba(255,48,56,0.15)]',
    danger:
      'bg-[#C81020] text-white hover:bg-[#E01025] shadow-[0_0_18px_rgba(200,16,32,0.6)] border border-[#FF3038]',
    outline:
      'bg-transparent text-[#FF3038] hover:bg-[#FF3038]/15 border border-[#FF3038] hover:shadow-[0_0_15px_rgba(255,48,56,0.35)]',
    ghost:
      'bg-transparent text-[#A0A0A8] hover:text-[#F5F5F5] hover:bg-white/5 border border-transparent',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon && <span className="inline-flex shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
