import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'red' | 'amber' | 'emerald' | 'cyan' | 'purple' | 'gray';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'red',
  size = 'sm',
  pulse = false,
}) => {
  const styles = {
    red: 'bg-[#FF3038]/15 border-[#FF3038]/40 text-[#FF5555]',
    amber: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
    emerald: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
    cyan: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400',
    purple: 'bg-purple-500/15 border-purple-500/40 text-purple-400',
    gray: 'bg-white/5 border-white/20 text-[#A0A0A8]',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded border font-semibold ${styles[variant]} ${sizes[size]}`}
    >
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
      )}
      {children}
    </span>
  );
};
