'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, X, Shield, Lock, SlidersHorizontal } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useShop } from '@/context/ShopContext';

export default function Header() {
  const {
    cart,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    totals,
  } = useShop();
  const router = useRouter();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header
      id="main-header"
      className="sticky top-0 z-30 w-full bg-[#F5F0E1] border-b border-[#E8E0CE]/80 shadow-[0_2px_12px_rgba(61,90,31,0.04)] transition-all"
    >
      {/* Top micro-announcement bar */}
      <div className="bg-[#3D5A1F] text-[#FAF7F0] text-[11px] sm:text-xs py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8A9E53] animate-pulse" />
        <span>Envíos naturales a todo el país • 100% Ingredientes botánicos certificados • Pedidos directos por WhatsApp</span>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-6">

          {/* Logo */}
          <div className="flex-shrink-0">
            <BrandLogo
              size="md"
              showTagline={true}
              onClick={() => router.push('/')}
            />
          </div>

          {/* Centered Search Bar */}
          <div className="flex-1 max-w-lg mx-2 sm:mx-6">
            <div
              className={`relative flex items-center rounded-xl bg-white border transition-all duration-200 ${
                isSearchFocused
                  ? 'border-[#6B7F3A] ring-2 ring-[#6B7F3A]/20 shadow-sm'
                  : 'border-[#E0E0E0] hover:border-[#6B7F3A]/60'
              }`}
            >
              <div className="pl-3.5 pr-2 text-[#6B6B6B]">
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Buscar suplementos, aceites, infusiones..."
                className="w-full py-2 sm:py-2.5 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#6B6B6B]/70 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  id="btn-clear-search"
                  onClick={() => setSearchQuery('')}
                  className="pr-3 text-[#6B6B6B] hover:text-[#3D5A1F] transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions: Admin Shortcut & Cart */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

            {/* Admin access button */}
            <button
              id="btn-nav-admin"
              onClick={() => router.push('/admin/login')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6B6B6B] hover:text-[#3D5A1F] hover:bg-white/60 rounded-lg transition-colors"
              title="Panel Administrativo"
            >
              <Lock className="w-3.5 h-3.5 text-[#6B7F3A]" />
              <span>Admin</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              id="btn-open-cart"
              onClick={() => setIsCartOpen(true)}
              aria-label="Ver carrito de compras"
              className="relative flex items-center gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-[#FAF7F0] border border-[#E8E0CE] rounded-xl shadow-xs transition-all duration-200 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#6B7F3A]"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#3D5A1F] group-hover:scale-105 transition-transform" />
                {totals.itemCount > 0 && (
                  <span
                    id="cart-badge-count"
                    className="absolute -top-2 -right-2.5 bg-[#3D5A1F] text-white font-bold text-[10px] min-w-[19px] h-[19px] rounded-full flex items-center justify-center px-1 shadow-sm animate-scaleIn"
                  >
                    {totals.itemCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-[11px] text-[#6B6B6B]">Mi Carrito</span>
                <span className="text-xs font-semibold text-[#1A1A1A]">
                  Bs. {totals.totalBs.toFixed(0)}
                </span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}