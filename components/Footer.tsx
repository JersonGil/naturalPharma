'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BrandLogo from './BrandLogo';
import { Leaf, Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const router = useRouter();

  return (
    <footer id="main-footer" className="w-full bg-[#F5F0E1] border-t border-[#E8E0CE] text-[#6B6B6B] mt-auto">

      {/* Upper footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
              Dedicados al bienestar botánico integral, con fórmulas limpias, materias primas orgánicas y respeto absoluto por los ciclos de la naturaleza.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#3D5A1F] font-semibold pt-1">
              <Leaf className="w-4 h-4 text-[#6B7F3A]" />
              <span>&ldquo;Naturalmente para ti&rdquo;</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A]">
              Líneas Botánicas
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <span className="hover:text-[#3D5A1F] transition-colors cursor-pointer">
                  Suplementos y Adaptógenos
                </span>
              </li>
              <li>
                <span className="hover:text-[#3D5A1F] transition-colors cursor-pointer">
                  Aceites Esenciales Puros
                </span>
              </li>
              <li>
                <span className="hover:text-[#3D5A1F] transition-colors cursor-pointer">
                  Cosmética Natural y Vegana
                </span>
              </li>
              <li>
                <span className="hover:text-[#3D5A1F] transition-colors cursor-pointer">
                  Tés e Infusiones Medicinales
                </span>
              </li>
              <li>
                <span className="hover:text-[#3D5A1F] transition-colors cursor-pointer">
                  Higiene y Cuidado Personal
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacto & Asesoría */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A]">
              Contacto & Asesoría
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#6B7F3A] flex-shrink-0" />
                <span>WhatsApp: +591 789 45612</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6B7F3A] flex-shrink-0" />
                <span>contacto@naturalspharma.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#6B7F3A] flex-shrink-0" />
                <span>Av. Botánica 420, Zona Central</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6B7F3A] flex-shrink-0" />
                <span>Lunes a Sábado: 08:30 – 19:00</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Garantía Natural & Admin Access */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A]">
              Compromiso de Pureza
            </h4>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Todos nuestros lotes son analizados y certificados libres de conservantes artificiales, metales pesados y pesticidas.
            </p>
            <div className="pt-2">
              <button
                id="btn-footer-admin-link"
                onClick={() => router.push('/admin/login')}
                className="text-xs font-semibold text-[#3D5A1F] hover:text-[#1A1A1A] underline flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Acceso al Panel de Control</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Tagline */}
      <div className="border-t border-[#E8E0CE] bg-[#FAF7F0] py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B6B6B]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Natural&apos;s Pharma. Todos los derechos reservados.</span>
          </div>

          <div className="font-serif italic text-xs text-[#3D5A1F] flex items-center gap-1">
            <span>Naturalmente para ti</span>
            <Leaf className="w-3.5 h-3.5 text-[#6B7F3A] not-italic" />
          </div>
        </div>
      </div>

    </footer>
  );
}