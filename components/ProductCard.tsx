'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useShop } from '@/context/ShopContext';
import { ShoppingBag, Eye, Check, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setSelectedProduct } = useShop();
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <article
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-[#E8E0CE] hover:border-[#6B7F3A]/50 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(61,90,31,0.08)] overflow-hidden"
    >
      {/* Badge (if any) */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-block px-2.5 py-1 text-[10px] sm:text-xs font-semibold tracking-wide uppercase bg-[#3D5A1F] text-[#FAF7F0] rounded-lg shadow-xs">
            {product.badge}
          </span>
        </div>
      )}

      {/* Quick View Button on Top Right */}
      <button
        id={`btn-quickview-${product.id}`}
        onClick={() => setSelectedProduct(product)}
        className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-[#6B6B6B] hover:text-[#3D5A1F] hover:bg-white shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-200"
        title="Ver detalles botánicos"
        aria-label="Ver detalles"
      >
        <Eye className="w-4 h-4" />
      </button>

      {/* Square Image Container (1:1 aspect ratio) */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative w-full aspect-square bg-[#F5F0E1] cursor-pointer overflow-hidden p-3"
      >
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#FAF7F0] flex items-center justify-center">
          <Image
            src={imageError ? 'https://picsum.photos/seed/botanic/600/600' : product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Category tag & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-medium tracking-wide uppercase text-[#6B7F3A]">
            {product.category}
          </span>
          {product.rating && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#1A1A1A]">
              <Star className="w-3 h-3 fill-[#6B7F3A] text-[#6B7F3A]" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Product Name */}
        <h3
          onClick={() => setSelectedProduct(product)}
          className="font-serif text-base sm:text-lg font-semibold text-[#1A1A1A] group-hover:text-[#3D5A1F] transition-colors leading-snug cursor-pointer line-clamp-1 mb-1.5"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Short Description (max 2 lines) */}
        <p className="text-xs sm:text-[13px] text-[#6B6B6B] leading-relaxed line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Pricing Section */}
        <div className="pt-2 border-t border-[#F5F0E1] mb-3.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-semibold text-[#1A1A1A]">Bs.</span>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
              {product.priceBs.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-[#6B6B6B] mt-0.5">
            Ref. USD ${product.priceUsd.toFixed(2)}
          </div>
        </div>

        {/* Full-width "Agregar al carrito" Button */}
        <button
          id={`btn-add-cart-${product.id}`}
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6B7F3A] focus:ring-offset-2 select-none ${
            product.stock <= 0
              ? 'bg-[#E0E0E0] text-[#6B6B6B] cursor-not-allowed'
              : isAdded
              ? 'bg-[#3D5A1F] text-white scale-[0.98]'
              : 'bg-[#6B7F3A] hover:bg-[#3D5A1F] text-white active:scale-[0.98]'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>¡Agregado!</span>
            </>
          ) : product.stock <= 0 ? (
            <span>Agotado</span>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar al carrito</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
