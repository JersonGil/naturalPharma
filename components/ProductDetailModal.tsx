'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { X, ShoppingBag, Leaf, CheckCircle2, Shield, Star, Plus, Minus } from 'lucide-react';

export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart, setIsCartOpen } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!selectedProduct) return null;

  const handleAdd = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div
        id="product-detail-modal"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E8E0CE] overflow-hidden animate-scaleIn"
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/80 hover:bg-[#FAF7F0] text-[#3D5A1F] transition-colors shadow-xs"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          
          {/* Image col */}
          <div className="relative aspect-square sm:aspect-auto sm:h-full bg-[#F5F0E1] p-4 flex items-center justify-center">
            <div className="relative w-full h-full min-h-[260px] rounded-xl overflow-hidden bg-white shadow-2xs">
              <Image
                src={imageError ? 'https://picsum.photos/seed/detail/600/600' : selectedProduct.image}
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 640px) 100vw, 350px"
                className="object-cover object-center"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            </div>
            {selectedProduct.badge && (
              <span className="absolute top-6 left-6 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#3D5A1F] text-white rounded-lg shadow-xs">
                {selectedProduct.badge}
              </span>
            )}
          </div>

          {/* Details col */}
          <div className="p-6 sm:p-7 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#6B7F3A]">
                {selectedProduct.category}
              </span>
              
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-1 leading-snug">
                {selectedProduct.name}
              </h2>

              {selectedProduct.presentation && (
                <div className="text-xs text-[#6B6B6B] mt-0.5 font-medium">
                  {selectedProduct.presentation}
                </div>
              )}

              {/* Price */}
              <div className="mt-3 py-2 border-y border-[#F5F0E1]">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-semibold text-[#1A1A1A]">Bs.</span>
                  <span className="text-2xl font-bold text-[#1A1A1A]">
                    {selectedProduct.priceBs.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#6B6B6B] ml-2">
                    (USD ${selectedProduct.priceUsd.toFixed(2)})
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed mt-3">
                {selectedProduct.description}
              </p>

              {/* Ingredients / Mode of use if present */}
              {selectedProduct.ingredients && (
                <div className="mt-3 p-3 rounded-xl bg-[#FAF7F0] border border-[#E8E0CE] text-xs space-y-1">
                  <div className="font-semibold text-[#3D5A1F] flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-[#6B7F3A]" />
                    <span>Composición Botánica:</span>
                  </div>
                  <p className="text-[#6B6B6B] leading-snug">
                    {selectedProduct.ingredients}
                  </p>
                </div>
              )}

              {selectedProduct.usage && (
                <div className="mt-2 text-xs text-[#6B6B6B]">
                  <span className="font-semibold text-[#1A1A1A]">Modo de uso: </span>
                  {selectedProduct.usage}
                </div>
              )}
            </div>

            {/* Quantity and CTA */}
            <div className="pt-3 border-t border-[#F5F0E1] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A1A1A]">Cantidad:</span>
                <div className="inline-flex items-center rounded-lg border border-[#E0E0E0] bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-[#6B6B6B] hover:text-[#3D5A1F] hover:bg-[#FAF7F0]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center text-xs font-bold text-[#1A1A1A]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-[#6B6B6B] hover:text-[#3D5A1F] hover:bg-[#FAF7F0]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full py-3 px-4 rounded-xl bg-[#6B7F3A] hover:bg-[#3D5A1F] text-white font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Agregar al Carrito • Bs. {(selectedProduct.priceBs * quantity).toFixed(2)}</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
