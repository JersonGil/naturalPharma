# Natural's Pharma

Tienda naturista online para **Natural's Pharma** — catálogo paginado, carrito de
compras, cierre de pedido por WhatsApp y panel de administración con carga de
inventario desde Excel.

> _Naturalmente para ti._

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + **lucide-react**
- **Turso** (libSQL) como base de datos
- **bcryptjs** + **jose** (JWT) para autenticación del admin
- **xlsx** (SheetJS) para parsear el inventario
- Deploy en **Vercel** + **Turso**

## Estructura

```
.
├── app/                   # Rutas (App Router)
│   ├── api/               #   · Route Handlers (backend)
│   ├── admin/             #   · Panel admin
│   ├── page.tsx           #   · Tienda (público)
│   └── layout.tsx
├── components/            # Componentes UI (.tsx)
├── context/               # React Context (estado del carrito)
├── lib/                   # Utilidades + tipos + data
│   ├── db.ts              #   · Cliente Turso
│   ├── auth.ts            #   · bcrypt + JWT
│   ├── excel.ts           #   · Parser xlsx
│   ├── data.ts            #   · Productos iniciales (seed)
│   ├── types.ts
│   └── utils.ts
├── hooks/
├── data/
│   ├── schema.sql         # Esquema de la DB
│   └── products.db        # SQLite local (gitignored)
├── scripts/
│   ├── db-setup.ts        # Crea tablas + admin inicial
│   └── db-seed.ts         # Puebla productos iniciales
├── middleware.ts          # Protege /admin/*
├── next.config.ts
├── tailwind / postcss / eslint / tsconfig
└── .env.example
```

## Setup local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
cp .env.example .env.local
```

Para desarrollo local podés dejar `TURSO_DATABASE_URL` apuntando a un archivo
SQLite (`file:./data/products.db`) y sin `TURSO_AUTH_TOKEN`.

### 3. Inicializar la base de datos

```bash
npm run db:setup   # crea las tablas + admin inicial
npm run db:seed    # opcional: carga los 12 productos de demo
```

### 4. Levantar el server

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Setup en producción (Vercel + Turso)

### Turso

```bash
turso db create natural-pharma
turso db show natural-pharma --url        # → TURSO_DATABASE_URL
turso auth tokens create natural-pharma   # → TURSO_AUTH_TOKEN
```

### Vercel

1. Importá el repo desde GitHub en [vercel.com](https://vercel.com).
2. Configurá las env vars (ver `.env.example`) en Project Settings → Environment.
3. Generá un `JWT_SECRET` con `openssl rand -hex 32`.
4. Definí `INITIAL_ADMIN_USER` y `INITIAL_ADMIN_PASSWORD` (se usan la primera vez
   que el setup script detecte que la tabla `admins` está vacía).
5. Deploy. El setup script corre automáticamente al primer request y crea las
   tablas + admin inicial.

## Variables de entorno

Ver [`.env.example`](./.env.example) para la lista completa.

## Formato del Excel de inventario

Subí un `.xlsx` con estas columnas:

| Columna      | Tipo    | Requerida | Notas |
|--------------|---------|:---------:|-------|
| `name`       | texto   | ✅ | Nombre del producto |
| `description`| texto   | ✅ | Descripción corta |
| `category`   | texto   | ✅ | Una de: `Suplementos`, `Aceites esenciales`, `Cosmética natural`, `Tés e infusiones`, `Cuidado personal` |
| `priceBs`    | número  | ✅ | Precio en bolivianos |
| `priceUsd`   | número  | ✅ | Precio en dólares |
| `image`      | URL     | ✅ | URL pública de la imagen |
| `stock`      | número  | ✅ | Unidades disponibles |
| `badge`      | texto   | ❌ | Etiqueta corta ("Vegano", "Artesanal", etc.) |
| `rating`     | número  | ❌ | 0.0 a 5.0 |
| `presentation` | texto | ❌ | Presentación del producto |
| `ingredients` | texto  | ❌ | Ingredientes |
| `benefits`   | texto   | ❌ | Lista separada por `\|` (se guarda como array) |
| `usage`      | texto   | ❌ | Modo de uso |

> Cada upload **reemplaza** el catálogo completo.

## Licencia

Privado. © Natural's Pharma.