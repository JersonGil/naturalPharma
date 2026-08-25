'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { Leaf, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function ToastContainer() {
  const { toasts, removeToast } = useShop();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto rounded-2xl p-4 shadow-xl border flex items-start gap-3 text-white ${
              toast.type === 'success'
                ? 'bg-[#3D5A1F] border-[#6B7F3A]/40' // Exact requirement: Fondo verde bosque (#3D5A1F)
                : toast.type === 'error'
                ? 'bg-[#2A3E15] border-[#3D5A1F]'
                : 'bg-[#1A1A1A] border-[#3D5A1F]'
            }`}
          >
            {/* Icon */}
            <div className="p-1 rounded-lg bg-white/10 text-white mt-0.5 flex-shrink-0">
              {toast.type === 'success' ? (
                <Leaf className="w-4 h-4 text-[#8A9E53]" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-[#FAF7F0]" />
              ) : (
                <Info className="w-4 h-4 text-[#8A9E53]" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs sm:text-sm font-bold tracking-tight text-white leading-snug font-serif">
                {toast.title}
              </h5>
              {toast.message && (
                <p className="text-[11px] sm:text-xs text-[#FAF7F0]/90 leading-normal mt-0.5">
                  {toast.message}
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#FAF7F0]/70 hover:text-white p-1 transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
