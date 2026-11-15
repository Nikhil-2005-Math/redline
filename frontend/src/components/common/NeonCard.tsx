import React from 'react';

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverEffect?: boolean;
  badge?: string;
  badgeColor?: 'red' | 'amber' | 'emerald' | 'blue';
  onClick?: () => void;
}

export const NeonCard: React.FC<NeonCardProps> = ({
  children,
  className = '',
  glow = false,
  hoverEffect = true,
  badge,
  badgeColor = 'red',
  onClick,
}) => {
  const badgeClasses = {
    red: 'border-[#FF3038]/50 text-[#FF5555] bg-[#FF3038]/10',
    amber: 'border-amber-500/50 text-amber-400 bg-amber-500/10',
    emerald: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10',
    blue: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10',
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-xl bg-[#101014] border border-[#FF3038]/30 
        transition-all duration-300
        ${glow ? 'shadow-[0_0_20px_rgba(255,48,56,0.22)]' : 'shadow-[0_4px_20px_rgba(0,0,0,0.5)]'}
        ${hoverEffect ? 'hover:border-[#FF3038]/80 hover:bg-[#15151B] hover:shadow-[0_0_25px_rgba(255,48,56,0.35)] hover:-translate-y-0.5' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {badge && (
        <div className="absolute -top-3 right-4">
          <span
            className={`px-2.5 py-0.5 text-xs font-mono rounded-full border backdrop-blur-md uppercase tracking-wider font-semibold ${badgeClasses[badgeColor]}`}
          >
            {badge}
          </span>
        </div>
      )}
      {children}
    </div>
  );
};
