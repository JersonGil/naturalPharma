'use client';

import React from 'react';
import { Leaf } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  isWhite?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function BrandLogo({
  size = 'md',
  showTagline = false,
  isWhite = false,
  onClick,
  className = '',
}: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div
      id="brand-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none transition-transform duration-200 ${
        onClick ? 'cursor-pointer hover:opacity-90 active:scale-[0.98]' : ''
      } ${className}`}
    >
      {/* Botanical Leaf Emblem */}
      <div
        className={`relative flex items-center justify-center rounded-full transition-colors ${
          isWhite
            ? 'bg-white/10 text-white'
            : 'bg-[#6B7F3A]/15 text-[#3D5A1F]'
        } ${
          size === 'sm'
            ? 'p-1.5'
            : size === 'md'
            ? 'p-2'
            : size === 'lg'
            ? 'p-3'
            : 'p-4'
        }`}
      >
        <Leaf
          className={`${iconSizes[size]} transition-transform duration-300 transform -rotate-12 hover:rotate-0 stroke-[1.8]`}
        />
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${
            isWhite ? 'bg-[#FAF7F0]' : 'bg-[#6B7F3A]'
          }`}
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <span
          className={`font-serif tracking-tight font-semibold leading-none ${
            titleSizes[size]
          } ${isWhite ? 'text-white' : 'text-[#1A1A1A]'}`}
        >
          Natural&apos;s Pharma
        </span>
        {showTagline && (
          <span
            className={`font-sans tracking-wide text-xs mt-1 ${
              isWhite ? 'text-white/80' : 'text-[#6B7F3A] font-medium'
            }`}
          >
            Naturalmente para ti
          </span>
        )}
      </div>
    </div>
  );
}
