'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandLogo from './BrandLogo';
import { useShop } from '@/context/ShopContext';
import { Eye, EyeOff, Lock, User, ArrowLeft, Leaf, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const { showToast } = useShop();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data?.error || 'Credenciales no válidas. Por favor verifica tu usuario y contraseña.');
        return;
      }

      showToast({
        type: 'success',
        title: 'Sesión iniciada',
        message: 'Bienvenido al panel de inventario y gestión.',
      });
      router.push('/admin');
      router.refresh();
    } catch {
      setErrorMessage('No se pudo conectar con el servidor. Intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="admin-login-screen"
      className="min-h-[calc(100vh-140px)] w-full bg-[#F5F0E1] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden"
    >
      {/* Subtle decorative leaf background elements */}
      <div className="absolute -bottom-16 -left-16 text-[#6B7F3A]/10 pointer-events-none select-none">
        <Leaf className="w-80 h-80 rotate-12" />
      </div>
      <div className="absolute -top-20 -right-16 text-[#3D5A1F]/10 pointer-events-none select-none">
        <Leaf className="w-72 h-72 -rotate-45" />
      </div>

      {/* Back to store shortcut */}
      <div className="w-full max-w-[400px] mb-4">
        <button
          id="btn-login-back-store"
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6B6B] hover:text-[#3D5A1F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la tienda</span>
        </button>
      </div>

      {/* Centered White Card (max-width ~400px, 8-12px rounded corners, subtle shadow) */}
      <div
        id="admin-login-card"
        className="w-full max-w-[400px] bg-white rounded-2xl p-7 sm:p-8 shadow-[0_8px_30px_rgba(61,90,31,0.06)] border border-[#E8E0CE] relative z-10"
      >
        {/* Logo Natural's Pharma at top centered */}
        <div className="flex flex-col items-center text-center mb-6">
          <BrandLogo size="md" showTagline={false} />

          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-4 tracking-tight">
            Panel de Administración
          </h2>

          <p className="font-sans text-xs text-[#6B7F3A] font-medium mt-1">
            Naturalmente para ti
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Usuario input with visible label */}
          <div>
            <label
              htmlFor="admin-username"
              className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
            >
              Usuario
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-[#6B6B6B]">
                <User className="w-4 h-4" />
              </div>
              <input
                id="admin-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej. admin@naturalspharma.com"
                autoComplete="username"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F0] border border-[#E0E0E0] rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-[#6B6B6B]/60 focus:bg-white focus:outline-none focus:border-[#6B7F3A] focus:ring-2 focus:ring-[#6B7F3A]/20 transition-all"
              />
            </div>
          </div>

          {/* Contraseña input with visible label + eye visibility toggle */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-[#1A1A1A]"
              >
                Contraseña
              </label>
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-3 text-[#6B6B6B]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full pl-9 pr-10 py-2.5 bg-[#FAF7F0] border border-[#E0E0E0] rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-[#6B6B6B]/60 focus:bg-white focus:outline-none focus:border-[#6B7F3A] focus:ring-2 focus:ring-[#6B7F3A]/20 transition-all"
              />
              <button
                type="button"
                id="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#6B6B6B] hover:text-[#3D5A1F] transition-colors p-1"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Full-width "Ingresar" Button in verde salvia with hover verde bosque */}
          <button
            id="btn-admin-submit"
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#6B7F3A] hover:bg-[#3D5A1F] text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-xs active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#6B7F3A] focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Ingresar</span>
            )}
          </button>
        </form>

        {/* Subtle error message in verde bosque if failed (not red!) */}
        {errorMessage && (
          <div
            id="admin-login-error"
            className="mt-4 p-3 rounded-xl bg-[#F5F0E1] border border-[#3D5A1F]/30 text-[#3D5A1F] text-xs leading-relaxed flex items-start gap-2 animate-fadeIn"
          >
            <ShieldCheck className="w-4 h-4 text-[#3D5A1F] flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Demo credentials hint */}
        <div className="mt-6 pt-4 border-t border-[#F5F0E1] text-center">
          <p className="text-[11px] text-[#6B6B6B]">
            Acceso seguro para administración de inventario Excel y catálogo
          </p>
        </div>
      </div>
    </div>
  );
}