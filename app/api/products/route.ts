import { NextRequest, NextResponse } from 'next/server';
import { ensureSetup } from '@/lib/setup';
import { query } from '@/lib/db';
import { rowToProduct, type ProductRow } from '@/lib/products';

export const dynamic = 'force-dynamic';

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

export async function GET(request: NextRequest) {
  await ensureSetup();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.trim() ?? '';
  const category = searchParams.get('category')?.trim() ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );
  const offset = (page - 1) * pageSize;

  const conditions: string[] = [];
  const args: (string | number)[] = [];

  if (search) {
    const pattern = `%${search}%`;
    conditions.push('(name LIKE ? OR description LIKE ? OR category LIKE ?)');
    args.push(pattern, pattern, pattern);
  }

  if (category && category !== 'Todos') {
    conditions.push('category = ?');
    args.push(category);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await query<{ count: number }>(
    `SELECT COUNT(*) as count FROM products ${whereClause}`,
    args
  );
  const total = Number(countResult[0]?.count ?? 0);

  const rows = await query<ProductRow>(
    `SELECT id, name, description, category, priceBs, priceUsd, image, stock,
            badge, rating, presentation, ingredients, benefits, usage,
            createdAt, updatedAt
     FROM products
     ${whereClause}
     ORDER BY name ASC
     LIMIT ? OFFSET ?`,
    [...args, pageSize, offset]
  );

  return NextResponse.json({
    products: rows.map(rowToProduct),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}