import * as XLSX from 'xlsx';
import { writeFileSync } from 'fs';

const sampleProducts = [
  {
    Nombre: 'Vitamina C Liposomal 1000mg',
    Descripción: 'Ácido ascórbico encapsulado en liposomas para máxima biodisponibilidad y protección antioxidante.',
    Categoría: 'Suplementos',
    'Precio BS': 540,
    'Precio USD': 14.79,
    Imagen: 'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?auto=format&fit=crop&w=600&q=80',
    Stock: 38,
    Badge: 'Inmune',
    Rating: 4.9,
    Presentación: 'Frasco con 60 cápsulas vegetales',
    Ingredientes: 'Vitamina C liposomada 1000mg, fosfatidilcolina, cápsula de celulosa.',
    Beneficios: 'Alta biodisponibilidad|Refuerza el sistema inmune|Antioxidante celular',
    Uso: 'Tomar 1 cápsula diaria con el desayuno.',
  },
  {
    Nombre: 'Aceite de Coco Virgen Extra Prensado en Frío',
    Descripción: 'Aceite de coco orgánico de primera presión para uso culinario y cosmético.',
    Categoría: 'Cuidado personal',
    'Precio BS': 280,
    'Precio USD': 7.67,
    Imagen: 'https://images.unsplash.com/photo-1591382386627-349b692688ff?auto=format&fit=crop&w=600&q=80',
    Stock: 60,
    Badge: 'Orgánico',
    Rating: 4.8,
    Presentación: 'Frasco de vidrio de 500ml',
    Ingredientes: 'Cocos nucifera 100% orgánicos prensados en frío.',
    Beneficios: 'Ácidos grasos de cadena media|Versátil culinario y cosmético|Hidrata piel y cabello',
    Uso: 'Como aceite de cocina, removedor de maquillaje o mascarilla capilar.',
  },
  {
    Nombre: 'Infusión Relajante de Valeriana y Pasiflora',
    Descripción: 'Mezcla tradicional de hierbas para promover el descanso nocturno profundo.',
    Categoría: 'Tés e infusiones',
    'Precio BS': 310,
    'Precio USD': 8.49,
    Imagen: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80',
    Stock: 45,
    Badge: 'Sleep',
    Rating: 4.7,
    Presentación: 'Bolsa compostable de 80g',
    Ingredientes: 'Valeriana officinalis, Passiflora incarnata, tilo y manzanilla.',
    Beneficios: 'Promueve el sueño reparador|Sin melatonina sintética|Aroma floral suave',
    Uso: 'Infusionar 1 cucharada en 250ml de agua caliente 10 minutos antes de dormir.',
  },
];

const worksheet = XLSX.utils.json_to_sheet(sampleProducts);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');

const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
writeFileSync('/tmp/test-inventory.xlsx', buffer);
console.log('Sample xlsx written to /tmp/test-inventory.xlsx (3 products)');