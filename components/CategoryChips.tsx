'use client';

import React, { useRef } from 'react';
import { CATEGORIES } from '@/lib/data';
import { useShop } from '@/context/ShopContext';
import { Sparkles, Pill, Droplet, Sparkle, Coffee, Heart } from 'lucide-react';

export default function CategoryChips() {
  const { selectedCategory, setSelectedCategory } = useShop();
  const scrollRef = useRef<HTMLDivElement>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Todos':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'Suplementos':
        return <Pill className="w-3.5 h-3.5" />;
      case 'Aceites esenciales':
        return <Droplet className="w-3.5 h-3.5" />;
      case 'Cosmética natural':
        return <Sparkle className="w-3.5 h-3.5" />;
      case 'Tés e infusiones':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'Cuidado personal':
        return <Heart className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div id="category-chips-bar" className="w-full bg-[#FAF7F0] border-b border-[#E8E0CE]/60 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 scroll-smooth"
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                id={`category-chip-${category.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#3D5A1F] text-white shadow-xs scale-[1.02]'
                    : 'bg-white text-[#1A1A1A] hover:text-[#3D5A1F] hover:bg-[#F5F0E1] border border-[#E8E0CE]'
                }`}
              >
                <span className={isSelected ? 'text-[#FAF7F0]' : 'text-[#6B7F3A]'}>
                  {getCategoryIcon(category)}
                </span>
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
