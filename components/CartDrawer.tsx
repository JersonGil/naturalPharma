'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '@/context/ShopContext';
import { X, Plus, Minus, Trash2, Leaf, Send, Sparkles, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totals,
    generateWhatsAppLink,
  } = useShop();

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleConfirmOrder = () => {
    const link = generateWhatsAppLink();
    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Overlay: Black 50% opacity backdrop */}
          <motion.div
            id="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
          />

          {/* Drawer Container: Responsive (Slide from right in desktop / slide from bottom / full-screen in mobile) */}
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <motion.div
              id="cart-drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md md:max-w-lg bg-white flex flex-col shadow-2xl relative z-10 h-full overflow-hidden"
            >
              {/* Header: "Tu carrito" en serif + botón X verde bosque */}
              <div className="px-6 py-4.5 bg-[#FAF7F0] border-b border-[#E8E0CE] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#6B7F3A]/15 text-[#3D5A1F]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                      Tu carrito
                    </h2>
                    <span className="text-xs text-[#6B6B6B]">
                      {totals.itemCount} {totals.itemCount === 1 ? 'artículo seleccionado' : 'artículos seleccionados'}
                    </span>
                  </div>
                </div>

                {/* Close Button X en verde bosque */}
                <button
                  id="btn-close-cart"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl text-[#3D5A1F] hover:bg-[#EAE3D0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B7F3A]"
                  aria-label="Cerrar carrito"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body: Items list or Empty State */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {cart.length > 0 ? (
                  <>
                    <div className="divide-y divide-[#F5F0E1]">
                      {cart.map(({ product, quantity }) => {
                        const itemTotalBs = product.priceBs * quantity;
                        const itemTotalUsd = product.priceUsd * quantity;

                        return (
                          <div
                            key={product.id}
                            id={`cart-item-${product.id}`}
                            className="py-4 first:pt-0 last:pb-0 flex items-center gap-3.5 sm:gap-4"
                          >
                            {/* Square thumbnail */}
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#F5F0E1] flex-shrink-0 overflow-hidden border border-[#E8E0CE]">
                              <Image
                                src={
                                  imageErrors[product.id]
                                    ? 'https://picsum.photos/seed/thumb/200/200'
                                    : product.image
                                }
                                alt={product.name}
                                fill
                                sizes="80px"
                                className="object-cover"
                                referrerPolicy="no-referrer"
                                onError={() => handleImageError(product.id)}
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium text-xs sm:text-sm text-[#1A1A1A] line-clamp-1 leading-snug">
                                  {product.name}
                                </h4>
                                
                                {/* Trash button in gris medio */}
                                <button
                                  id={`btn-remove-item-${product.id}`}
                                  onClick={() => removeFromCart(product.id)}
                                  className="text-[#6B6B6B] hover:text-[#3D5A1F] p-1 transition-colors"
                                  title="Quitar producto"
                                  aria-label="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Unit Price */}
                              <div className="text-[11px] text-[#6B6B6B] mt-0.5">
                                Unitario: Bs. {product.priceBs.toFixed(2)} (USD ${product.priceUsd.toFixed(2)})
                              </div>

                              {/* Bottom row: [- N +] controls + Subtotal */}
                              <div className="flex items-center justify-between mt-2.5">
                                
                                {/* [- N +] Quantity Controls */}
                                <div className="inline-flex items-center rounded-lg border border-[#E0E0E0] bg-white overflow-hidden shadow-2xs">
                                  <button
                                    id={`btn-qty-minus-${product.id}`}
                                    onClick={() => updateQuantity(product.id, quantity - 1)}
                                    className="p-1.5 text-[#6B6B6B] hover:text-[#3D5A1F] hover:bg-[#6B7F3A]/10 transition-colors focus:outline-none"
                                    aria-label="Disminuir cantidad"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  
                                  <span className="w-8 text-center text-xs font-semibold text-[#1A1A1A] select-none">
                                    {quantity}
                                  </span>

                                  <button
                                    id={`btn-qty-plus-${product.id}`}
                                    onClick={() => updateQuantity(product.id, quantity + 1)}
                                    className="p-1.5 text-[#6B6B6B] hover:text-[#3D5A1F] hover:bg-[#6B7F3A]/10 transition-colors focus:outline-none"
                                    aria-label="Aumentar cantidad"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Row Subtotal */}
                                <div className="text-right">
                                  <div className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
                                    Bs. {itemTotalBs.toFixed(2)}
                                  </div>
                                  <div className="text-[10px] text-[#6B6B6B]">
                                    USD ${itemTotalUsd.toFixed(2)}
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Free shipping banner */}
                    <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E8E0CE] flex items-center gap-2.5 text-xs text-[#3D5A1F]">
                      <Sparkles className="w-4 h-4 text-[#6B7F3A] flex-shrink-0" />
                      <span>
                        {totals.totalBs >= 250
                          ? '¡Genial! Tu pedido califica para embalaje botánico especial.'
                          : `Agrega Bs. ${(250 - totals.totalBs).toFixed(2)} más para obtener obsequio de infusión relajante.`}
                      </span>
                    </div>
                  </>
                ) : (
                  /* Empty state: Minimalist leaf illustration + serif text "Tu carrito está vacío" + subtitle + button */
                  <div
                    id="cart-empty-view"
                    className="h-full flex flex-col items-center justify-center text-center py-12 px-4"
                  >
                    <div className="relative mb-5">
                      <div className="w-20 h-20 rounded-full bg-[#FAF7F0] border border-[#E8E0CE] flex items-center justify-center text-[#6B7F3A]">
                        <Leaf className="w-10 h-10 -rotate-12 animate-leaf" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#3D5A1F] text-white flex items-center justify-center text-[10px] font-bold">
                        0
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">
                      Tu carrito está vacío
                    </h3>

                    <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-xs mb-6 leading-relaxed">
                      Seguí explorando productos naturales y encontrá fórmulas botánicas creadas para tu bienestar.
                    </p>

                    <button
                      id="btn-cart-continue-shopping"
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-3 rounded-xl bg-[#6B7F3A] hover:bg-[#3D5A1F] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
                    >
                      Seguir comprando
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer: Subtotal BS/USD, Total grande BS, Divisor Crema, Botón WhatsApp full-width */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-6 bg-[#FAF7F0] border-t border-[#E8E0CE] space-y-3.5">
                  
                  {/* Subtotals in gris medio */}
                  <div className="space-y-1.5 text-xs text-[#6B6B6B]">
                    <div className="flex justify-between items-center">
                      <span>Subtotal estimado:</span>
                      <span className="font-medium text-[#1A1A1A]">
                        Bs. {totals.subtotalBs.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Referencia en dólares:</span>
                      <span>USD ${totals.subtotalUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Preparación botánica:</span>
                      <span className="text-[#3D5A1F] font-medium">Sin costo adicional</span>
                    </div>
                  </div>

                  {/* Crema Divider */}
                  <div className="h-px bg-[#E8E0CE]" />

                  {/* Total in BS prominent black */}
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">
                      Total del pedido:
                    </span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                        Bs. {totals.totalBs.toFixed(2)}
                      </span>
                      <div className="text-[11px] text-[#6B6B6B]">
                        ≈ USD ${totals.totalUsd.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Botón verde salvia full-width "Confirmar pedido por WhatsApp" */}
                  <button
                    id="btn-confirm-whatsapp"
                    onClick={handleConfirmOrder}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#6B7F3A] hover:bg-[#3D5A1F] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-sm transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#6B7F3A] focus:ring-offset-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirmar pedido por WhatsApp</span>
                  </button>

                  <p className="text-[10px] text-center text-[#6B6B6B] leading-tight">
                    Serás redirigido a WhatsApp con el detalle de tus productos para acordar pago y despacho con un asesor botánico.
                  </p>
                </div>
              )}

            </motion.div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
}
