'use client';

import React from 'react';

// Pre-computed sparkle positions for consistent rendering
const sparklePositions = [
  { left: '15%', top: '10%', delay: '0s', duration: '2.5s' },
  { left: '85%', top: '8%', delay: '0.3s', duration: '3s' },
  { left: '25%', top: '25%', delay: '0.7s', duration: '2.2s' },
  { left: '70%', top: '20%', delay: '1s', duration: '2.8s' },
  { left: '45%', top: '5%', delay: '1.5s', duration: '2.4s' },
  { left: '60%', top: '30%', delay: '0.5s', duration: '3.2s' },
  { left: '10%', top: '35%', delay: '2s', duration: '2.6s' },
  { left: '90%', top: '25%', delay: '0.8s', duration: '2.9s' },
  { left: '35%', top: '15%', delay: '1.2s', duration: '2.3s' },
  { left: '55%', top: '40%', delay: '1.8s', duration: '2.7s' },
  { left: '20%', top: '42%', delay: '0.4s', duration: '3.1s' },
  { left: '75%', top: '38%', delay: '1.4s', duration: '2.5s' },
  { left: '50%', top: '12%', delay: '0.9s', duration: '2.8s' },
  { left: '30%', top: '45%', delay: '1.6s', duration: '2.4s' },
  { left: '80%', top: '15%', delay: '0.2s', duration: '3s' },
];

interface SparklesProps {
  count?: number;
}

export function Sparkles({ count = 12 }: SparklesProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparklePositions.slice(0, count).map((sparkle, i) => (
        <div
          key={i}
          className="absolute animate-twinkle"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            animationDelay: sparkle.delay,
            animationDuration: sparkle.duration,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="#FDE047"
            className="drop-shadow-sm"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

interface CloudProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Cloud({ className = '', style = {} }: CloudProps) {
  return (
    <div className={`absolute animate-float-slow ${className}`} style={style}>
      <svg viewBox="0 0 200 100" className="w-full h-full opacity-60">
        <ellipse cx="60" cy="60" rx="50" ry="30" fill="white" />
        <ellipse cx="100" cy="50" rx="60" ry="40" fill="white" />
        <ellipse cx="150" cy="60" rx="45" ry="28" fill="white" />
      </svg>
    </div>
  );
}

interface MagicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function MagicButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
}: MagicButtonProps) {
  const baseStyles = 'w-full py-3.5 rounded-full font-medium text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-white/10 text-purple-200 border border-white/10 hover:bg-white/15',
    ghost: 'bg-transparent text-purple-300 hover:text-purple-200',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 ${className}`}>
      {children}
    </div>
  );
}
