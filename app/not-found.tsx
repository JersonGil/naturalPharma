import Link from 'next/link';
import React from 'react';
import { Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[#E5EAD7] flex items-center justify-center text-[#3D5A1F] mb-6">
        <Leaf className="w-8 h-8" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D5A1F] mb-3">
        Página no encontrada
      </h1>
      <p className="text-[#6B6B6B] max-w-md mb-8">
        La página que estás buscando no existe o ha sido movida dentro de nuestro catálogo natural.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#6B7F3A] hover:bg-[#3D5A1F] text-white font-medium rounded-full transition-colors shadow-sm"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
