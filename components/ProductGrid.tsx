'use client';

import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useShop } from '@/context/ShopContext';
import { Leaf, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function ProductGrid() {
  const { products, selectedCategory, searchQuery, setSearchQuery, setSelectedCategory } = useShop();
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCat =
        selectedCategory === 'Todos' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.ingredients && item.ingredients.toLowerCase().includes(query)) ||
        (item.badge && item.badge.toLowerCase().includes(query));

      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const activePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, activePage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Smooth scroll to top of grid
      const gridElem = document.getElementById('catalog-section');
      if (gridElem) {
        gridElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section id="catalog-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header bar of Catalog */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-[#E8E0CE]/70">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              {selectedCategory === 'Todos' ? 'Catálogo Botánico Completo' : selectedCategory}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F5F0E1] text-[#3D5A1F] text-xs font-semibold">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>
          {searchQuery && (
            <p className="text-xs text-[#6B6B6B] mt-1">
              Resultados para búsqueda: &ldquo;<span className="font-semibold text-[#1A1A1A]">{searchQuery}</span>&rdquo;
            </p>
          )}
        </div>

        {/* Quick filter summary / Reset button */}
        {(selectedCategory !== 'Todos' || searchQuery) && (
          <button
            id="btn-reset-filters"
            onClick={() => {
              setSelectedCategory('Todos');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7F3A] hover:text-[#3D5A1F] py-1 px-2.5 rounded-lg bg-[#F5F0E1] hover:bg-[#EAE3D0] transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restablecer filtros</span>
          </button>
        )}
      </div>

      {/* Product Grid: 4 cols desktop, 3 tablet, 2 mobile, 1 small mobile */}
      {filteredProducts.length > 0 ? (
        <div
          id="products-grid"
          className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty state for search/category */
        <div
          id="products-empty-state"
          className="flex flex-col items-center justify-center text-center py-16 px-4 bg-[#FAF7F0] rounded-2xl border border-dashed border-[#E8E0CE]"
        >
          <div className="p-4 rounded-full bg-[#F5F0E1] text-[#6B7F3A] mb-4">
            <Leaf className="w-10 h-10 -rotate-12" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">
            No encontramos productos con estos criterios
          </h3>
          <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-md mb-6">
            Intenta buscando con otros términos botánicos o explorando nuestras categorías de infusiones, suplementos o aceites.
          </p>
          <button
            id="btn-clear-empty-state"
            onClick={() => {
              setSelectedCategory('Todos');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 bg-[#6B7F3A] hover:bg-[#3D5A1F] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-xs"
          >
            Ver todos los productos
          </button>
        </div>
      )}

      {/* Pagination: « ‹ 1 2 3 … › » */}
      {totalPages > 1 && (
        <div id="pagination-controls" className="flex items-center justify-center gap-1.5 sm:gap-2 mt-10 sm:mt-12 select-none">
          
          {/* First page */}
          <button
            id="btn-page-first"
            onClick={() => handlePageChange(1)}
            disabled={activePage === 1}
            aria-label="Primera página"
            className="p-2 sm:p-2.5 rounded-xl border border-[#E8E0CE] bg-white text-[#6B6B6B] hover:text-[#3D5A1F] hover:bg-[#F5F0E1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous page */}
          <button
            id="btn-page-prev"
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            aria-label="Página anterior"
            className="p-2 sm:p-2.5 rounded-xl border border-[#E8E0CE] bg-white text-[#6B6B6B] hover:text-[#3D5A1F] hover:bg-[#F5F0E1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Numbered Page Buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const isActive = pageNum === activePage;
            return (
              <button
                key={pageNum}
                id={`btn-page-${pageNum}`}
                onClick={() => handlePageChange(pageNum)}
                className={`min-w-[38px] sm:min-w-[42px] h-[38px] sm:h-[42px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#3D5A1F] text-white shadow-xs scale-105'
                    : 'bg-white text-[#1A1A1A] hover:bg-[#F5F0E1] hover:text-[#3D5A1F] border border-[#E8E0CE]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next page */}
          <button
            id="btn-page-next"
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
            aria-label="Página siguiente"
            className="p-2 sm:p-2.5 rounded-xl border border-[#E8E0CE] bg-white text-[#6B6B6B] hover:text-[#3D5A1F] hover:bg-[#F5F0E1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last page */}
          <button
            id="btn-page-last"
            onClick={() => handlePageChange(totalPages)}
            disabled={activePage === totalPages}
            aria-label="Última página"
            className="p-2 sm:p-2.5 rounded-xl border border-[#E8E0CE] bg-white text-[#6B6B6B] hover:text-[#3D5A1F] hover:bg-[#F5F0E1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>

        </div>
      )}

    </section>
  );
}
