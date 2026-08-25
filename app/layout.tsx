import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Natural's Pharma | Naturalmente para ti",
  description: "Tienda naturista y farmacia botánica con productos orgánicos, suplementos, aceites esenciales y cosmética natural.",
  keywords: ["tienda naturista", "productos naturales", "suplementos", "aceites esenciales", "cosmetica natural", "Naturals Pharma"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-[#FFFFFF] text-[#1A1A1A] font-sans antialiased selection:bg-[#6B7F3A]/20 selection:text-[#3D5A1F]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
