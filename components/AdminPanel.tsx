'use client';

import React, { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BrandLogo from './BrandLogo';
import { useShop } from '@/context/ShopContext';
import { Product } from '@/lib/types';
import {
  UploadCloud,
  FileSpreadsheet,
  Trash2,
  Plus,
  Search,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Download,
  AlertCircle,
  Package,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const ADMIN_PAGE_SIZE = 6;

export default function AdminPanel() {
  const {
    products,
    deleteProduct,
    addProduct,
    loadInventoryExcel,
    resetInventoryToDefault,
    refreshProducts,
    showToast,
  } = useShop();
  const router = useRouter();

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState('Todos');
  const [adminPage, setAdminPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // New product manual form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState('Suplementos');
  const [newProdPriceBs, setNewProdPriceBs] = useState('');
  const [newProdPriceUsd, setNewProdPriceUsd] = useState('');
  const [newProdStock, setNewProdStock] = useState('25');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore — proceed anyway
    }
    showToast({
      type: 'info',
      title: 'Sesión finalizada',
      message: 'Has cerrado sesión del panel de administración.',
    });
    router.push('/');
    router.refresh();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setIsProcessingExcel(true);
    
    // Simulate real parsing and synchronization
    setTimeout(() => {
      setIsProcessingExcel(false);
      
      // Generate updated batch or append sample parsed batch
      const importedProducts: Product[] = [
        {
          id: `np-xl-${Date.now()}-1`,
          name: 'Probióticos Multicepa 50 Billones UFC',
          description: '14 cepas probióticas con prebióticos FOS para restaurar la microbiota y fortalecer la barrera digestiva.',
          category: 'Suplementos',
          priceBs: 780.0,
          priceUsd: 21.36,
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
          stock: 30,
          badge: 'Nuevo Lote',
          rating: 5.0,
        },
        {
          id: `np-xl-${Date.now()}-2`,
          name: 'Aceite Esencial de Eucalipto Radiata Orgánico',
          description: 'Destilación pura descongestionante respiratoria, purificador ambiental y tónico balsámico.',
          category: 'Aceites esenciales',
          priceBs: 390.0,
          priceUsd: 10.68,
          image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
          stock: 42,
          badge: 'Orgánico',
          rating: 4.8,
        },
        {
          id: `np-xl-${Date.now()}-3`,
          name: 'Crema Facial Regeneradora de Caléndula y Avena',
          description: 'Nutrición rica en lípidos botánicos para calmar eccemas, rojeces y pieles extremadamente sensibles.',
          category: 'Cosmética natural',
          priceBs: 540.0,
          priceUsd: 14.79,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
          stock: 19,
          badge: 'Vegano',
          rating: 4.9,
        },
        ...products.slice(0, 10),
      ];

      loadInventoryExcel(importedProducts);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1200);
  };

  const handleTriggerDemoExcel = () => {
    setIsProcessingExcel(true);
    setTimeout(() => {
      setIsProcessingExcel(false);
      const demoBatch: Product[] = [
        {
          id: `np-sync-1`,
          name: 'Cúrcuma Orgánica con Pimienta Negra y Jengibre',
          description: 'Potente antiinflamatorio natural con 95% de curcuminoides y piperina para máxima absorción.',
          category: 'Suplementos',
          priceBs: 620.0,
          priceUsd: 16.98,
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
          stock: 50,
          badge: 'Excel Sync',
          rating: 5.0,
        },
        {
          id: `np-sync-2`,
          name: 'Aceite Esencial de Menta Piperita Pura',
          description: 'Revitalizante mental, analgésico tópico para cefaleas tensionales y digestivo natural.',
          category: 'Aceites esenciales',
          priceBs: 410.0,
          priceUsd: 11.23,
          image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
          stock: 35,
          badge: '100% Puro',
          rating: 4.9,
        },
        {
          id: `np-sync-3`,
          name: 'Infusión Digestiva de Hinojo, Anís y Jengibre',
          description: 'Fórmula herbal carminativa tradicional para aliviar pesadez estomacal y flatulencias.',
          category: 'Tés e infusiones',
          priceBs: 280.0,
          priceUsd: 7.67,
          image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
          stock: 40,
          badge: 'Digestivo',
          rating: 4.8,
        },
        ...products,
      ];
      loadInventoryExcel(demoBatch);
    }, 1000);
  };

  const handleManualAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceBsNum = parseFloat(newProdPriceBs);
    const priceUsdNum = parseFloat(newProdPriceUsd) || Number((priceBsNum / 36.5).toFixed(2));

    if (!newProdName || isNaN(priceBsNum)) {
      alert('Por favor completa el nombre y precio en Bs.');
      return;
    }

    const created: Product = {
      id: `np-manual-${Date.now()}`,
      name: newProdName,
      description: newProdDesc || 'Fórmula natural botánica elaborada con extractos orgánicos certificados.',
      category: newProdCat,
      priceBs: priceBsNum,
      priceUsd: priceUsdNum,
      image: newProdImage || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
      stock: parseInt(newProdStock) || 20,
      badge: 'Nuevo',
      rating: 5.0,
    };

    addProduct(created);
    setShowAddModal(false);
    setNewProdName('');
    setNewProdPriceBs('');
    setNewProdPriceUsd('');
    setNewProdDesc('');
    setNewProdImage('');
  };

  // Filtered table rows
  const filteredTableProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = tableCategory === 'Todos' || p.category === tableCategory;
      const matchSearch =
        !tableSearch ||
        p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(tableSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(tableSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, tableCategory, tableSearch]);

  const totalTablePages = Math.ceil(filteredTableProducts.length / ADMIN_PAGE_SIZE) || 1;
  const paginatedTableProducts = useMemo(() => {
    const start = (adminPage - 1) * ADMIN_PAGE_SIZE;
    return filteredTableProducts.slice(start, start + ADMIN_PAGE_SIZE);
  }, [filteredTableProducts, adminPage]);

  return (
    <div id="admin-panel-screen" className="min-h-screen bg-[#FAF7F0] pb-16">
      
      {/* Header sobre fondo crema */}
      <div className="bg-[#F5F0E1] border-b border-[#E8E0CE] sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: small logo + serif title "Panel de Administración" + Subtítulo */}
            <div className="flex items-center gap-3">
              <BrandLogo size="sm" showTagline={false} />
              <div className="hidden sm:block h-6 w-px bg-[#E8E0CE]" />
              <div>
                <h1 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A] leading-tight">
                  Panel de Administración
                </h1>
                <p className="text-[11px] text-[#6B7F3A] font-medium">
                  Naturalmente para ti
                </p>
              </div>
            </div>

            {/* Right: Quick store navigation + Logout */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                id="btn-admin-goto-store"
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#3D5A1F] bg-white hover:bg-[#FAF7F0] border border-[#E8E0CE] rounded-xl transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ver Tienda</span>
              </button>

              <button
                id="btn-admin-logout"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B6B6B] hover:text-[#3D5A1F] hover:bg-white/60 rounded-xl transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar sesión</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* KPI metrics bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E0CE] shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-[#6B7F3A]/15 text-[#3D5A1F]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#1A1A1A] font-serif">
                {products.length}
              </div>
              <div className="text-xs text-[#6B6B6B]">Productos en Catálogo</div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E0CE] shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-[#3D5A1F]/15 text-[#3D5A1F]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#1A1A1A] font-serif">
                {products.reduce((acc, p) => acc + p.stock, 0)}
              </div>
              <div className="text-xs text-[#6B6B6B]">Unidades en Stock</div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E0CE] shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-[#F5F0E1] text-[#6B7F3A]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#1A1A1A] font-serif">
                5
              </div>
              <div className="text-xs text-[#6B6B6B]">Líneas Botánicas</div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E0CE] shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-[#3D5A1F]/15 text-[#3D5A1F]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#1A1A1A] font-serif">
                100%
              </div>
              <div className="text-xs text-[#6B6B6B]">Sincronización Excel</div>
            </div>
          </div>
        </div>

        {/* SECTION: "Cargar inventario" (White card with big drop-zone) */}
        <section id="section-upload-inventory" className="bg-white rounded-2xl border border-[#E8E0CE] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                Cargar inventario
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6B6B] mt-0.5">
                Actualiza masivamente tu catálogo botánico mediante planillas Excel con precios en BS y USD.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-excel-demo"
                onClick={handleTriggerDemoExcel}
                disabled={isProcessingExcel}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#3D5A1F] bg-[#F5F0E1] hover:bg-[#EAE3D0] rounded-xl transition-colors"
                title="Sincronizar lote demo"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#6B7F3A]" />
                <span>Cargar Excel Demo</span>
              </button>

              <button
                id="btn-reset-default-inventory"
                onClick={resetInventoryToDefault}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#6B6B6B] hover:text-[#3D5A1F] hover:bg-[#FAF7F0] rounded-xl transition-colors border border-[#E8E0CE]"
                title="Restablecer a 12 productos predeterminados"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>
            </div>
          </div>

          {/* Hidden real file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileSelect}
            className="hidden"
            id="excel-file-input"
          />

          {/* Large Drop Zone (dashed border verde salvia #6B7F3A, upload icon en verde bosque #3D5A1F) */}
          <div
            id="excel-dropzone"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer p-8 sm:p-12 text-center flex flex-col items-center justify-center select-none ${
              isDragging
                ? 'border-[#3D5A1F] bg-[#6B7F3A]/10 scale-[1.005]'
                : 'border-[#6B7F3A] bg-[#FAF7F0]/60 hover:bg-[#FAF7F0] hover:border-[#3D5A1F]'
            }`}
          >
            {isProcessingExcel ? (
              /* Indicador sutil de carga al procesar el Excel (spinner verde salvia) */
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <div className="w-10 h-10 border-3 border-[#6B7F3A]/25 border-t-[#6B7F3A] rounded-full animate-spin" />
                <p className="text-sm font-semibold text-[#3D5A1F]">
                  Procesando planilla Excel y validando catálogo...
                </p>
                <p className="text-xs text-[#6B6B6B]">
                  Calculando conversiones y actualizando existencias.
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-white text-[#3D5A1F] shadow-xs border border-[#E8E0CE] mb-3.5">
                  <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-[#3D5A1F]" />
                </div>
                
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">
                  Arrastrá tu Excel acá o hacé clic para seleccionar
                </h3>
                
                <p className="text-xs text-[#6B6B6B] mt-1">
                  Formato: <span className="font-semibold text-[#3D5A1F]">.xlsx</span>, .xls o .csv (Columnas: Nombre, Categoría, Precio BS, Precio USD, Stock, Descripción)
                </p>
              </>
            )}
          </div>
        </section>

        {/* SECTION: Tabla de productos */}
        <section id="section-admin-table" className="bg-white rounded-2xl border border-[#E8E0CE] p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Header Controls for Table */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                Gestión de Productos
              </h2>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                Visualiza, busca y administra los productos publicados en la tienda.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search input in table */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => {
                    setTableSearch(e.target.value);
                    setAdminPage(1);
                  }}
                  placeholder="Buscar en tabla..."
                  className="pl-9 pr-3 py-2 bg-[#FAF7F0] border border-[#E0E0E0] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#6B7F3A]"
                />
              </div>

              {/* Category Filter */}
              <select
                value={tableCategory}
                onChange={(e) => {
                  setTableCategory(e.target.value);
                  setAdminPage(1);
                }}
                className="py-2 px-3 bg-[#FAF7F0] border border-[#E0E0E0] rounded-xl text-xs text-[#1A1A1A] font-medium focus:outline-none focus:border-[#6B7F3A]"
              >
                <option value="Todos">Todas las Categorías</option>
                <option value="Suplementos">Suplementos</option>
                <option value="Aceites esenciales">Aceites esenciales</option>
                <option value="Cosmética natural">Cosmética natural</option>
                <option value="Tés e infusiones">Tés e infusiones</option>
                <option value="Cuidado personal">Cuidado personal</option>
              </select>

              {/* Add Single Product Button */}
              <button
                id="btn-admin-add-product"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6B7F3A] hover:bg-[#3D5A1F] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Producto</span>
              </button>
            </div>
          </div>

          {/* Table Container with Horizontal Scroll for Mobile */}
          <div className="overflow-x-auto rounded-xl border border-[#E8E0CE]">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[650px]">
              
              {/* Header */}
              <thead>
                <tr className="bg-[#F5F0E1] text-[#1A1A1A] font-semibold border-b border-[#E8E0CE]">
                  <th className="py-3.5 px-4 w-16">Imagen</th>
                  <th className="py-3.5 px-4">Nombre</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4 text-right">Precio BS</th>
                  <th className="py-3.5 px-4 text-right">Precio USD</th>
                  <th className="py-3.5 px-4 text-center">Stock</th>
                  <th className="py-3.5 px-4 text-center w-24">Acciones</th>
                </tr>
              </thead>

              {/* Rows: Filas alternadas con fondo crema muy suave (#FAF7F0) */}
              <tbody className="divide-y divide-[#E8E0CE]/60">
                {paginatedTableProducts.length > 0 ? (
                  paginatedTableProducts.map((prod, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <tr
                        key={prod.id}
                        id={`admin-row-${prod.id}`}
                        className={`transition-colors hover:bg-[#6B7F3A]/5 ${
                          isEven ? 'bg-white' : 'bg-[#FAF7F0]'
                        }`}
                      >
                        {/* Imagen miniatura */}
                        <td className="py-3 px-4">
                          <div className="relative w-11 h-11 rounded-lg bg-[#F5F0E1] overflow-hidden border border-[#E8E0CE] flex-shrink-0">
                            <Image
                              src={
                                imageErrors[prod.id]
                                  ? 'https://picsum.photos/seed/pharma/150/150'
                                  : prod.image
                              }
                              alt={prod.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                              referrerPolicy="no-referrer"
                              onError={() =>
                                setImageErrors((prev) => ({ ...prev, [prod.id]: true }))
                              }
                            />
                          </div>
                        </td>

                        {/* Nombre */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#1A1A1A] leading-tight">
                            {prod.name}
                          </div>
                          <div className="text-[11px] text-[#6B6B6B] line-clamp-1 mt-0.5">
                            {prod.description}
                          </div>
                        </td>

                        {/* Categoría */}
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-[#F5F0E1] text-[#3D5A1F] text-[11px] font-semibold">
                            {prod.category}
                          </span>
                        </td>

                        {/* Precio BS */}
                        <td className="py-3 px-4 text-right font-bold text-[#1A1A1A]">
                          Bs. {prod.priceBs.toFixed(2)}
                        </td>

                        {/* Precio USD */}
                        <td className="py-3 px-4 text-right text-[#6B6B6B]">
                          ${prod.priceUsd.toFixed(2)}
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              prod.stock > 10
                                ? 'bg-[#6B7F3A]/15 text-[#3D5A1F]'
                                : prod.stock > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {prod.stock} un.
                          </span>
                        </td>

                        {/* Acciones: ícono tacho verde bosque */}
                        <td className="py-3 px-4 text-center">
                          <button
                            id={`btn-admin-delete-${prod.id}`}
                            onClick={() => deleteProduct(prod.id)}
                            className="p-1.5 rounded-lg text-[#3D5A1F] hover:bg-[#3D5A1F]/10 transition-colors"
                            title="Eliminar producto"
                            aria-label="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-[#6B6B6B] bg-[#FAF7F0]">
                      No se encontraron productos coincidentes en el inventario.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación de tabla abajo */}
          {totalTablePages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-[#6B6B6B]">
                Mostrando página {adminPage} de {totalTablePages} ({filteredTableProducts.length} productos)
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setAdminPage((p) => Math.max(1, p - 1))}
                  disabled={adminPage === 1}
                  className="p-2 rounded-lg border border-[#E8E0CE] bg-white text-[#6B6B6B] hover:text-[#3D5A1F] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalTablePages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setAdminPage(pg)}
                    className={`min-w-[32px] h-[32px] rounded-lg text-xs font-semibold transition-colors ${
                      pg === adminPage
                        ? 'bg-[#3D5A1F] text-white'
                        : 'bg-white text-[#1A1A1A] hover:bg-[#F5F0E1] border border-[#E8E0CE]'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  onClick={() => setAdminPage((p) => Math.min(totalTablePages, p + 1))}
                  disabled={adminPage === totalTablePages}
                  className="p-2 rounded-lg border border-[#E8E0CE] bg-white text-[#6B6B6B] hover:text-[#3D5A1F] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>

      </div>

      {/* Manual Product Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8E0CE] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0CE]">
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
                Registrar Nuevo Producto Botánico
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#6B6B6B] hover:text-[#3D5A1F]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualAddProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="ej. Extracto de Propóleo Verde 70%"
                  className="w-full p-2.5 bg-[#FAF7F0] border border-[#E0E0E0] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#6B7F3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Categoría *
                  </label>
                  <select
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F0] border border-[#E0E0E0] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#6B7F3A]"
                  >
                    <option value="Suplementos">Suplementos</option>
                    <option value="Aceites esenciales">Aceites esenciales</option>
                    <option value="Cosmética natural">Cosmética natural</option>
                    <option value="Tés e infusiones">Tés e infusiones</option>
                    <option value="Cuidado personal">Cuidado personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Stock (unidades)
                  </label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F0] border border-[#E0E0E0] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#6B7F3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Precio en BS *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPriceBs}
                    onChange={(e) => {
                      setNewProdPriceBs(e.target.value);
                      if (e.target.value) {
                        setNewProdPriceUsd((parseFloat(e.target.value) / 36.5).toFixed(2));
                      }
                    }}
                    placeholder="450.00"
                    className="w-full p-2.5 bg-[#FAF7F0] border border-[#E0E0E0] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#6B7F3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Precio en USD (automático o manual)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdPriceUsd}
                    onChange={(e) => setNewProdPriceUsd(e.target.value)}
                    placeholder="12.30"
                    className="w-full p-2.5 bg-[#FAF7F0] border border-[#E0E0E0] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#6B7F3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Descripción Corta
                </label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Descripción de beneficios botánicos y modo de uso..."
                  className="w-full p-2.5 bg-[#FAF7F0] border border-[#E0E0E0] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#6B7F3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  URL de Imagen (opcional)
                </label>
                <input
                  type="text"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-[#FAF7F0] border border-[#E0E0E0] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#6B7F3A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E8E0CE]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#6B7F3A] hover:bg-[#3D5A1F] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
