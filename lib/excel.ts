import * as XLSX from 'xlsx';
import { randomUUID } from 'crypto';

export interface ParsedProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  priceBs: number;
  priceUsd: number;
  image: string;
  stock: number;
  badge?: string;
  rating?: number;
  presentation?: string;
  ingredients?: string;
  benefits?: string[];
  usage?: string;
}

const REQUIRED_KEYS = ['name', 'description', 'category', 'pricebs', 'priceusd', 'image', 'stock'];

// Sinónimos ES/EN para que el Excel funcione con cualquiera de los dos esquemas
const ALIASES: Record<string, string[]> = {
  name: ['name', 'nombre'],
  description: ['description', 'descripcion', 'descripción'],
  category: ['category', 'categoria', 'categoría'],
  pricebs: ['pricebs', 'preciobs', 'precio bs', 'precio(enbs)', 'precio bs.'],
  priceusd: ['priceusd', 'preciousd', 'precio usd', 'precio en usd', 'precio(enusd)', 'precio usd.'],
  image: ['image', 'imagen', 'urlimagen', 'imageurl'],
  stock: ['stock', 'cantidad', 'unidades'],
  badge: ['badge', 'etiqueta'],
  rating: ['rating', 'calificacion', 'calificación'],
  presentation: ['presentation', 'presentacion', 'presentación'],
  ingredients: ['ingredients', 'ingredientes'],
  benefits: ['benefits', 'beneficios'],
  usage: ['usage', 'uso', 'mododeuso', 'modo de uso'],
};

function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/[()]/g, '');
}

function findKey(row: Record<string, unknown>, target: string): string | null {
  const aliases = ALIASES[target] ?? [target];
  for (const key of Object.keys(row)) {
    const norm = normalizeKey(key);
    if (aliases.some((a) => normalizeKey(a) === norm)) return key;
  }
  return null;
}

function getValue(row: Record<string, unknown>, target: string): unknown {
  const key = findKey(row, target);
  if (!key) return undefined;
  const val = row[key];
  if (val === '' || val === null || val === undefined) return undefined;
  return val;
}

function parseNumber(val: unknown): number | null {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/\s/g, '').replace(',', '.');
    const n = parseFloat(cleaned);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

function parseString(val: unknown): string | undefined {
  if (val === undefined || val === null) return undefined;
  const s = String(val).trim();
  return s === '' ? undefined : s;
}

function parseBenefits(val: unknown): string[] | undefined {
  const s = parseString(val);
  if (!s) return undefined;
  return s
    .split(/[|;]/)
    .map((b) => b.trim())
    .filter(Boolean);
}

export class ExcelParseError extends Error {}

export async function parseExcelFile(
  buffer: ArrayBuffer
): Promise<ParsedProduct[]> {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new ExcelParseError('El archivo no contiene hojas.');
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
  });

  if (rows.length === 0) {
    throw new ExcelParseError('La hoja está vacía.');
  }

  // Validar columnas requeridas
  const missing = REQUIRED_KEYS.filter((r) => findKey(rows[0], r) === null);
  if (missing.length > 0) {
    const friendly = missing.map((k) => ALIASES[k]?.[0] ?? k).join(', ');
    const found = Object.keys(rows[0]).join(', ');
    throw new ExcelParseError(
      `Faltan columnas requeridas (${friendly}). Columnas encontradas: ${found}`
    );
  }

  const products: ParsedProduct[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // header en fila 1

    const name = parseString(getValue(row, 'name'));
    if (!name) {
      errors.push(`Fila ${rowNum}: sin nombre, saltada.`);
      continue;
    }

    const priceBs = parseNumber(getValue(row, 'pricebs'));
    const priceUsd = parseNumber(getValue(row, 'priceusd'));

    if (priceBs === null || priceUsd === null) {
      errors.push(`Fila ${rowNum} (${name}): precios inválidos, saltada.`);
      continue;
    }

    const stockVal = parseNumber(getValue(row, 'stock'));
    const stock = stockVal ?? 0;

    products.push({
      id: `np-xl-${randomUUID()}`,
      name,
      description: parseString(getValue(row, 'description')) ?? '',
      category: parseString(getValue(row, 'category')) ?? 'Cuidado personal',
      priceBs,
      priceUsd,
      image: parseString(getValue(row, 'image')) ?? '',
      stock,
      badge: parseString(getValue(row, 'badge')),
      rating: parseNumber(getValue(row, 'rating')) ?? undefined,
      presentation: parseString(getValue(row, 'presentation')),
      ingredients: parseString(getValue(row, 'ingredients')),
      benefits: parseBenefits(getValue(row, 'benefits')),
      usage: parseString(getValue(row, 'usage')),
    });
  }

  if (products.length === 0) {
    throw new ExcelParseError(
      `Ninguna fila válida. Errores:\n${errors.slice(0, 5).join('\n')}`
    );
  }

  if (errors.length > 0) {
    console.warn(
      `[excel] ${errors.length} fila(s) saltada(s):\n${errors.slice(0, 5).join('\n')}`
    );
  }

  return products;
}