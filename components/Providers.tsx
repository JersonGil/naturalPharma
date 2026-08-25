'use client';

import React from 'react';
import { ShopProvider } from '@/context/ShopContext';
import ToastContainer from './ToastContainer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ShopProvider>
      {children}
      <ToastContainer />
    </ShopProvider>
  );
}