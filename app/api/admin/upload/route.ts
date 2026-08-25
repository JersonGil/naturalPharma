import { NextRequest, NextResponse } from 'next/server';
import { ensureSetup } from '@/lib/setup';
import { getCurrentAdmin } from '@/lib/auth';
import { executeBatch } from '@/lib/db';
import { parseExcelFile, ExcelParseError, type ParsedProduct } from '@/lib/excel';

export const dynamic = 'force-dynamic';

const ACCEPTED_MIME = new Set([
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'text/csv', // .csv
]);

export async function POST(request: NextRequest) {
  await ensureSetup();

  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'No se pudo leer el cuerpo del request.' },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Falta el archivo (campo "file").' },
      { status: 400 }
    );
  }

  const filename = file.name || '';
  const isAcceptedExt = /\.(xlsx|xls|csv)$/i.test(filename);
  if (!isAcceptedExt && !ACCEPTED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: 'Formato no soportado. Usá .xlsx, .xls o .csv.' },
      { status: 400 }
    );
  }

  const buffer = await file.arrayBuffer();

  let products: ParsedProduct[];
  try {
    products = await parseExcelFile(buffer);
  } catch (err) {
    if (err instanceof ExcelParseError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Error al parsear el archivo.' },
      { status: 400 }
    );
  }

  // Estrategia: REEMPLAZA el catálogo completo
  const statements = [
    { sql: 'DELETE FROM products', args: [] },
    ...products.map((p) => ({
      sql: `INSERT INTO products
              (id, name, description, category, priceBs, priceUsd, image,
               stock, badge, rating, presentation, ingredients, benefits, usage)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.id,
        p.name,
        p.description,
        p.category,
        p.priceBs,
        p.priceUsd,
        p.image,
        p.stock,
        p.badge ?? null,
        p.rating ?? null,
        p.presentation ?? null,
        p.ingredients ?? null,
        p.benefits && p.benefits.length > 0 ? p.benefits.join('|') : null,
        p.usage ?? null,
      ],
    })),
  ];

  try {
    await executeBatch(statements);
  } catch (err) {
    console.error('[upload] DB error:', err);
    return NextResponse.json(
      { error: 'Error al guardar en la base de datos.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    count: products.length,
    message: `Inventario actualizado: ${products.length} productos cargados.`,
  });
}