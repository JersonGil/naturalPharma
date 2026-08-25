'use client';

import React from 'react';
import Header from './Header';
import CategoryChips from './CategoryChips';
import Hero from './Hero';
import ProductGrid from './ProductGrid';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import ProductDetailModal from './ProductDetailModal';
import ToastContainer from './ToastContainer';

export default function ShopApp() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F0ECE1]">
      <Header />
      <main className="flex-1 flex flex-col">
        <CategoryChips />
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
      <CartDrawer />
      <ProductDetailModal />
      <ToastContainer />
    </div>
  );
}