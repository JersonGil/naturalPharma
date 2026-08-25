'use client';

import React from 'react';
import { Leaf, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero-banner" className="relative w-full bg-[#F5F0E1]/60 border-b border-[#E8E0CE]/50 py-6 sm:py-8 overflow-hidden">
      {/* Subtle decorative background botanical leaf shapes */}
      <div className="absolute -right-8 -bottom-10 text-[#6B7F3A]/10 pointer-events-none select-none">
        <Leaf className="w-48 h-48 sm:w-64 sm:h-64 rotate-45" />
      </div>
      <div className="absolute -left-12 -top-10 text-[#3D5A1F]/5 pointer-events-none select-none">
        <Leaf className="w-36 h-36 -rotate-12" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6B7F3A]/15 text-[#3D5A1F] text-[11px] sm:text-xs font-semibold mb-2">
              <Leaf className="w-3.5 h-3.5 text-[#6B7F3A]" />
              <span>Botánica Pura & Bienestar Integral</span>
            </div>
            
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1A1A1A] tracking-tight leading-tight">
              Naturalmente para ti
            </h1>
            
            <p className="mt-1.5 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed max-w-xl">
              Extractos puros, fitoterapia de alta biodisponibilidad y cosmética limpia. Creado para acompañar tu salud de forma orgánica, armónica y consciente.
            </p>
          </div>

          {/* Quick Natural Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-[#3D5A1F] font-medium pt-1 md:pt-0">
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-[#E8E0CE]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7F3A]" />
              <span>100% Orgánico</span>
            </div>
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-[#E8E0CE]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7F3A]" />
              <span>Libre de Químicos</span>
            </div>
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-[#E8E0CE]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7F3A]" />
              <span>Grado Farmacéutico</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
