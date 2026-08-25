'use client';

import React, { useEffect } from 'react';
import { Leaf, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to an error reporting service if available
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[#E5EAD7] flex items-center justify-center text-[#3D5A1F] mb-6">
        <Leaf className="w-8 h-8" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3D5A1F] mb-3">
        Ha ocurrido un inconveniente
      </h2>
      <p className="text-[#6B6B6B] max-w-md mb-8">
        No te preocupes, tus datos locales se mantienen a salvo. Haz clic en reintentar para restablecer la vista.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#6B7F3A] hover:bg-[#3D5A1F] text-white font-medium rounded-full transition-colors shadow-sm cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        Reintentar
      </button>
    </div>
  );
}
