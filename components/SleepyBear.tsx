'use client';

import React from 'react';

type BearMood = 'sleeping' | 'waking' | 'excited' | 'reading' | 'waving' | 'happy';
type BearSize = 'small' | 'medium' | 'large' | 'hero';

interface SleepyBearProps {
  mood?: BearMood;
  size?: BearSize;
  className?: string;
  showZzz?: boolean;
}

const sizeClasses: Record<BearSize, string> = {
  small: 'w-16 h-16',
  medium: 'w-24 h-24',
  large: 'w-40 h-40',
  hero: 'w-48 h-48',
};

const moodConfig: Record<BearMood, { eyes: string; animation: string }> = {
  sleeping: { eyes: 'closed', animation: 'animate-breathe' },
  waking: { eyes: 'half', animation: 'animate-wiggle' },
  excited: { eyes: 'open', animation: 'animate-bounce-soft' },
  reading: { eyes: 'focused', animation: '' },
  waving: { eyes: 'happy', animation: 'animate-wave' },
  happy: { eyes: 'happy', animation: 'animate-bounce-soft' },
};

export default function SleepyBear({ 
  mood = 'sleeping', 
  size = 'medium', 
  className = '',
  showZzz = false 
}: SleepyBearProps) {
  const { eyes, animation } = moodConfig[mood] || moodConfig.sleeping;
  
  return (
    <div className={`${sizeClasses[size]} ${animation} ${className} relative`}>
      {/* Zzz bubbles when sleeping */}
      {showZzz && mood === 'sleeping' && (
        <span className="absolute -top-1 -right-1 text-sm animate-float">💤</span>
      )}
      
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Bear body */}
        <ellipse cx="50" cy="70" rx="30" ry="25" fill="#8B6914" />
        
        {/* Pajamas */}
        <ellipse cx="50" cy="70" rx="28" ry="23" fill="#6BA3D6" />
        <rect x="25" y="50" width="50" height="40" fill="#6BA3D6" rx="15" />
        
        {/* Pajama stripes */}
        <rect x="28" y="52" width="44" height="3" fill="white" opacity="0.6" rx="1" />
        <rect x="28" y="60" width="44" height="3" fill="white" opacity="0.6" rx="1" />
        <rect x="28" y="68" width="44" height="3" fill="white" opacity="0.6" rx="1" />
        <rect x="28" y="76" width="44" height="3" fill="white" opacity="0.6" rx="1" />
        
        {/* Bear head */}
        <circle cx="50" cy="35" r="25" fill="#C4913F" />
        
        {/* Ears */}
        <circle cx="30" cy="15" r="10" fill="#C4913F" />
        <circle cx="70" cy="15" r="10" fill="#C4913F" />
        <circle cx="30" cy="15" r="6" fill="#E8C088" />
        <circle cx="70" cy="15" r="6" fill="#E8C088" />
        
        {/* Face / Muzzle */}
        <ellipse cx="50" cy="42" rx="12" ry="10" fill="#E8C088" />
        
        {/* Nose */}
        <ellipse cx="50" cy="40" rx="5" ry="4" fill="#5C4033" />
        
        {/* Eyes - Closed (sleeping) */}
        {eyes === 'closed' && (
          <g>
            <path d="M 38 32 Q 42 35 46 32" stroke="#5C4033" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 54 32 Q 58 35 62 32" stroke="#5C4033" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}
        
        {/* Eyes - Half open (waking) */}
        {eyes === 'half' && (
          <g>
            <ellipse cx="42" cy="32" rx="4" ry="2" fill="#5C4033" />
            <ellipse cx="58" cy="32" rx="4" ry="2" fill="#5C4033" />
          </g>
        )}
        
        {/* Eyes - Open (excited/reading) */}
        {(eyes === 'open' || eyes === 'focused') && (
          <g>
            <circle cx="42" cy="32" r="4" fill="#5C4033" />
            <circle cx="58" cy="32" r="4" fill="#5C4033" />
            {/* Sparkle in eyes */}
            <circle cx="43" cy="31" r="1.5" fill="white" />
            <circle cx="59" cy="31" r="1.5" fill="white" />
          </g>
        )}
        
        {/* Eyes - Happy (curved up) */}
        {eyes === 'happy' && (
          <g>
            <path d="M 38 32 Q 42 28 46 32" stroke="#5C4033" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 54 32 Q 58 28 62 32" stroke="#5C4033" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}
        
        {/* Mouth - gentle smile */}
        <path d="M 46 46 Q 50 50 54 46" stroke="#5C4033" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        
        {/* Blush circles */}
        <circle cx="35" cy="38" r="4" fill="#FFB6C1" opacity="0.5" />
        <circle cx="65" cy="38" r="4" fill="#FFB6C1" opacity="0.5" />
        
        {/* Night cap */}
        <path d="M 28 25 Q 50 -5 72 25 Q 75 20 78 30 Q 65 15 50 10 Q 35 15 22 30 Q 25 20 28 25" fill="#6BA3D6" />
        <circle cx="78" cy="8" r="6" fill="white" />
        <rect x="25" y="22" width="50" height="6" fill="white" rx="3" />
      </svg>
    </div>
  );
}

// Also export the types for use elsewhere
export type { BearMood, BearSize, SleepyBearProps };
