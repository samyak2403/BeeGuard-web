import React from 'react';

export type BadgeVariant = 'healthy' | 'warning' | 'danger' | 'info' | 'gold' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  dot = false
}) => {
  const styles: Record<BadgeVariant, { bg: string; dotColor: string }> = {
    healthy: {
      bg: 'bg-emerald-100 text-emerald-700 border-transparent',
      dotColor: 'bg-emerald-500'
    },
    warning: {
      bg: 'bg-amber-100 text-amber-700 border-transparent',
      dotColor: 'bg-amber-500'
    },
    danger: {
      bg: 'bg-red-100 text-red-700 border-transparent',
      dotColor: 'bg-red-500'
    },
    info: {
      bg: 'bg-blue-100 text-blue-700 border-transparent',
      dotColor: 'bg-blue-500'
    },
    gold: {
      bg: 'bg-amber-100 text-amber-800 border-transparent',
      dotColor: 'bg-amber-500'
    },
    neutral: {
      bg: 'bg-slate-100 text-slate-700 border-transparent',
      dotColor: 'bg-slate-500'
    }
  };

  const current = styles[variant];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${current.bg} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor}`} />}
      {children}
    </span>
  );
};
