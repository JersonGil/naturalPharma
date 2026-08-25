'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem, ToastMessage } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/data';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Inventory actions (client-side optimistic; will sync with API in Phase 5/6)
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  loadInventoryExcel: (newProducts: Product[]) => void;
  resetInventoryToDefault: () => void;
  refreshProducts: () => Promise<void>;

  // Checkout & totals
  whatsappNumber: string;
  generateWhatsAppLink: () => string;
  totals: {
    itemCount: number;
    subtotalBs: number;
    subtotalUsd: number;
    totalBs: number;
    totalUsd: number;
  };
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const toastCounterRef = useRef(0);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('naturals_pharma_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '59178945612';

  // Persist cart to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('naturals_pharma_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    toastCounterRef.current += 1;
    const id = `toast-item-${toastCounterRef.current}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    showToast({
      type: 'success',
      title: '¡Producto agregado!',
      message: `${product.name} añadido a tu carrito.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    showToast({
      type: 'success',
      title: 'Producto registrado',
      message: `${product.name} ha sido añadido al inventario.`,
    });
  };

  const deleteProduct = (id: string) => {
    const p = products.find((x) => x.id === id);
    setProducts((prev) => prev.filter((x) => x.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    showToast({
      type: 'info',
      title: 'Producto eliminado',
      message: p ? `${p.name} fue quitado del catálogo.` : 'Producto eliminado.',
    });
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    showToast({
      type: 'success',
      title: 'Producto actualizado',
      message: 'Los cambios se guardaron correctamente.',
    });
  };

  const loadInventoryExcel = (newProducts: Product[]) => {
    setProducts(newProducts);
    showToast({
      type: 'success',
      title: 'Inventario actualizado correctamente',
      message: `Se sincronizaron ${newProducts.length} productos desde la planilla Excel.`,
    });
  };

  const resetInventoryToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    showToast({
      type: 'info',
      title: 'Inventario restablecido',
      message: 'Se cargaron los 12 productos botánicos predeterminados.',
    });
  };

  // Refresh products from API (will wire up in Phase 6)
  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data?.products)) {
        setProducts(data.products);
      }
    } catch {
      // ignore — local state stays
    }
  };

  const totals = cart.reduce(
    (acc, item) => {
      const q = item.quantity;
      acc.itemCount += q;
      acc.subtotalBs += item.product.priceBs * q;
      acc.subtotalUsd += item.product.priceUsd * q;
      return acc;
    },
    { itemCount: 0, subtotalBs: 0, subtotalUsd: 0, totalBs: 0, totalUsd: 0 }
  );
  totals.totalBs = totals.subtotalBs;
  totals.totalUsd = totals.subtotalUsd;

  const generateWhatsAppLink = () => {
    if (cart.length === 0) return '#';

    let message = `🌿 *PEDIDO NATURAL'S PHARMA* 🌿\n`;
    message += `_"Naturalmente para ti"_\n\n`;
    message += `Hola, deseo confirmar el siguiente pedido de la tienda:\n\n`;

    cart.forEach((item, index) => {
      const p = item.product;
      message += `${index + 1}. *${p.name}*\n`;
      message += `   • Cantidad: ${item.quantity} un.\n`;
      message += `   • Subtotal: Bs. ${(p.priceBs * item.quantity).toFixed(2)} (USD $${(p.priceUsd * item.quantity).toFixed(2)})\n`;
    });

    message += `\n─────────────────────\n`;
    message += `🏷️ *TOTAL A PAGAR:* Bs. ${totals.totalBs.toFixed(2)} | USD $${totals.totalUsd.toFixed(2)}\n`;
    message += `─────────────────────\n\n`;
    message += `📍 Por favor indíquenme disponibilidad y datos para la entrega / pago. ¡Muchas gracias!`;

    const encoded = encodeURIComponent(message);
    const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNum}?text=${encoded}`;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        isCartOpen,
        setIsCartOpen,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        toasts,
        showToast,
        removeToast,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addProduct,
        deleteProduct,
        updateProduct,
        loadInventoryExcel,
        resetInventoryToDefault,
        refreshProducts,
        whatsappNumber,
        generateWhatsAppLink,
        totals,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}