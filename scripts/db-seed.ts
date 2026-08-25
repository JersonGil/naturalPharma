import { ensureSetup } from '../lib/setup';
import { executeBatch } from '../lib/db';
import { INITIAL_PRODUCTS } from '../lib/data';

const BENEFITS_SEP = '|';

function benefitsToString(benefits: string[] | undefined): string | null {
  if (!benefits || benefits.length === 0) return null;
  return benefits.join(BENEFITS_SEP);
}

async function main() {
  // Asegura que las tablas existan antes de poblar
  await ensureSetup();

  // Reemplaza el catálogo completo (estrategia REPLACE)
  const statements = [
    { sql: 'DELETE FROM products', args: [] as import('@libsql/client').InValue[] },
    ...INITIAL_PRODUCTS.map((p) => ({
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
        benefitsToString(p.benefits),
        p.usage ?? null,
      ],
    })),
  ];

  await executeBatch(statements);
  console.log(`✓ Seed completo: ${INITIAL_PRODUCTS.length} productos insertados.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('✗ Seed falló:', err);
    process.exit(1);
  });