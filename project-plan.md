# 🛍️ Vigo Store — خطة التنفيذ الكاملة
### Nuxt 3 + Prisma 6.x (Stable) + PostgreSQL + Docker

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Nuxt 3 (latest stable) |
| Backend | Nitro (built-in with Nuxt) |
| ORM | Prisma 6.x (stable) |
| Database | PostgreSQL 16 |
| Container | Docker + Docker Compose |
| Auth | JWT + bcrypt |
| State | Pinia |
| Styling | TailwindCSS |

---

## 🗂️ Folder Structure

```
vigo-store/
├── app/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── products/
│   │   ├── cart/
│   │   └── admin/
│   ├── composables/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useProducts.ts
│   ├── layouts/
│   │   ├── default.vue
│   │   └── dashboard.vue
│   ├── pages/
│   │   ├── index.vue
│   │   ├── products/
│   │   │   ├── index.vue
│   │   │   └── [id].vue
│   │   ├── cart.vue
│   │   ├── checkout.vue
│   │   ├── auth/
│   │   │   ├── login.vue
│   │   │   └── register.vue
│   │   └── dashboard/
│   │       ├── index.vue
│   │       ├── products/
│   │       ├── orders/
│   │       └── users/
│   ├── stores/
│   │   ├── auth.ts
│   │   ├── cart.ts
│   │   └── ui.ts
│   └── middleware/
│       ├── auth.ts
│       └── admin.ts
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   └── register.post.ts
│   │   ├── products/
│   │   │   ├── index.get.ts
│   │   │   └── [id].get.ts
│   │   ├── orders/
│   │   │   ├── index.post.ts
│   │   │   └── index.get.ts
│   │   ├── admin/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── users/
│   │   └── health.get.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── admin.ts
│   └── utils/
│       ├── prisma.ts
│       └── jwt.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
├── docker-compose.yml
├── .env
├── .env.example
├── nuxt.config.ts
└── package.json
```

---

## 🧱 PHASE 1 — Architecture & Setup

### 📅 Day 1 – Project Setup

#### 1.1 — Initialize Nuxt 3 Project

```bash
npx nuxi@latest init vigo-store
cd vigo-store
```

#### 1.2 — Install Dependencies

```bash
# Core
npm install @pinia/nuxt pinia
npm install @nuxtjs/tailwindcss

# Backend
npm install @prisma/client bcrypt jsonwebtoken dotenv
npm install -D prisma tsx typescript @types/node @types/bcrypt @types/jsonwebtoken

# Dev tools
npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier @nuxt/eslint-config
```

#### 1.3 — `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: vigo-store-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
      POSTGRES_DB: vigo_store
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d vigo_store"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

```bash
# شغّل قاعدة البيانات
docker-compose up -d postgres
```

#### 1.4 — `.env`

```env
DATABASE_URL=postgresql://admin:admin123@localhost:5432/vigo_store
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

#### 1.5 — `nuxt.config.ts`

```typescript
import 'dotenv/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    public: {}
  },
  nitro: {
    experimental: {
      wasm: true
    }
  }
})
```

#### 1.6 — `app/layouts/default.vue`

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
```

---

### 📅 Day 2 – Architecture Design

#### 2.1 — `server/utils/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client'

declare global {
  var __prismaClient: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
    datasourceUrl: process.env.DATABASE_URL,
  })
}

export const prisma = global.__prismaClient ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.__prismaClient = prisma
}
```

#### 2.2 — `server/utils/jwt.ts`

```typescript
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET)
}
```

#### 2.3 — `server/api/health.get.ts`

```typescript
export default defineEventHandler(async () => {
  const start = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    return {
      status: 'healthy',
      database: {
        connected: true,
        latency: `${Date.now() - start}ms`
      }
    }
  } catch {
    return { status: 'unhealthy', database: { connected: false } }
  }
})
```

---

## 🗄️ PHASE 2 — Database (Prisma 6.x Stable)

### 📅 Day 3 – Database Schema

#### 3.1 — Initialize Prisma

```bash
npx prisma init
```

#### 3.2 — `prisma/schema.prisma`

> ⚠️ نستخدم Prisma 6.x (stable) — الـ `url` لازم يكون موجود في الـ datasource

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  slug     String    @unique
  image    String?
  products Product[]

  @@map("categories")
}

model Product {
  id          Int         @id @default(autoincrement())
  name        String
  slug        String      @unique
  description String?
  price       Float
  stock       Int         @default(0)
  image       String?
  isActive    Boolean     @default(true)
  categoryId  Int
  category    Category    @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@map("products")
}

model Order {
  id         Int         @id @default(autoincrement())
  userId     Int
  user       User        @relation(fields: [userId], references: [id])
  status     OrderStatus @default(PENDING)
  total      Float
  items      OrderItem[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  @@map("orders")
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  order     Order   @relation(fields: [orderId], references: [id])
  productId Int
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float

  @@map("order_items")
}

enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

#### 3.3 — Run Migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### 📅 Day 4 – Database Seeding

#### 4.1 — `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
})

async function main() {
  // Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@vigo.com' },
    update: {},
    create: {
      email: 'admin@vigo.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    }
  })
  console.log('✅ Admin user created: admin@vigo.com')

  // Categories
  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Clothing', slug: 'clothing' },
    { name: 'Home & Garden', slug: 'home-garden' },
    { name: 'Books', slug: 'books' },
  ]
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Categories created: 4')

  // Products
  const electronicsCategory = await prisma.category.findUnique({
    where: { slug: 'electronics' }
  })

  const products = [
    { name: 'Wireless Headphones', slug: 'wireless-headphones', price: 99.99, stock: 50, categoryId: electronicsCategory!.id },
    { name: 'Smart Watch', slug: 'smart-watch', price: 199.99, stock: 30, categoryId: electronicsCategory!.id },
    { name: 'Laptop Stand', slug: 'laptop-stand', price: 49.99, stock: 100, categoryId: electronicsCategory!.id },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: { ...product, description: `Description for ${product.name}` },
    })
  }
  console.log('✅ Products created: 3')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
```

#### 4.2 — أضف script في `package.json`

```json
{
  "scripts": {
    "db:seed": "node --import tsx prisma/seed.ts",
    "db:migrate": "npx prisma migrate dev",
    "db:generate": "npx prisma generate",
    "db:studio": "npx prisma studio",
    "db:reset": "npx prisma migrate reset"
  }
}
```

```bash
npm run db:seed
```

---

## 🔌 PHASE 3 — Backend APIs

### 📅 Day 5 – Products API (Public)

#### 5.1 — `server/api/products/index.get.ts`

```typescript
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 12
    const search = query.search as string || ''
    const category = query.category as string || ''

    const where = {
      isActive: true,
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
      ...(category && { category: { slug: category } }),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch products' })
  }
})
```

#### 5.2 — `server/api/products/[id].get.ts`

```typescript
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  })
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  return product
})
```

---

### 📅 Day 6 – Auth API

#### 6.1 — `server/api/auth/register.post.ts`

```typescript
import bcrypt from 'bcrypt'
import { signToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, name, password } = body

  if (!email || !name || !password) {
    throw createError({ statusCode: 400, statusMessage: 'All fields required' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw createError({ statusCode: 409, statusMessage: 'Email already exists' })

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, name, password: hashedPassword }
  })

  const token = signToken({ id: user.id, email: user.email, role: user.role })
  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token }
})
```

#### 6.2 — `server/api/auth/login.post.ts`

```typescript
import bcrypt from 'bcrypt'
import { signToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  const token = signToken({ id: user.id, email: user.email, role: user.role })
  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token }
})
```

---

### 📅 Day 7 – Orders API

#### 7.1 — `server/api/orders/index.post.ts`

```typescript
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  const { items } = body // [{ productId, quantity }]

  if (!items?.length) throw createError({ statusCode: 400, statusMessage: 'Cart is empty' })

  // Fetch products and calculate total
  const productIds = items.map((i: any) => i.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

  let total = 0
  const orderItems = items.map((item: any) => {
    const product = products.find(p => p.id === item.productId)
    if (!product) throw createError({ statusCode: 404, statusMessage: `Product ${item.productId} not found` })
    total += product.price * item.quantity
    return { productId: item.productId, quantity: item.quantity, price: product.price }
  })

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      items: { create: orderItems }
    },
    include: { items: { include: { product: true } } }
  })

  return order
})
```

#### 7.2 — `server/api/orders/index.get.ts`

```typescript
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return orders
})
```

---

## 🛡️ PHASE 4 — Security Layer

### 📅 Day 8 – Auth Middleware

#### 8.1 — `server/middleware/auth.ts`

```typescript
import { verifyToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const protectedRoutes = ['/api/orders', '/api/admin']
  const path = event.node.req.url || ''

  const isProtected = protectedRoutes.some(route => path.startsWith(route))
  if (!isProtected) return

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'No token provided' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    event.context.user = decoded
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})
```

---

### 📅 Day 9 – Admin Middleware

#### 9.1 — `server/middleware/admin.ts`

```typescript
export default defineEventHandler(async (event) => {
  const path = event.node.req.url || ''
  if (!path.startsWith('/api/admin')) return

  const user = event.context.user
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }
})
```

---

## 🧑‍💼 PHASE 5 — Admin Dashboard

### 📅 Day 10 – Dashboard Layout

#### 10.1 — `app/layouts/dashboard.vue`

```vue
<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md">
      <div class="p-6 border-b">
        <h2 class="text-xl font-bold text-gray-800">🛍️ Vigo Admin</h2>
      </div>
      <nav class="p-4 space-y-2">
        <NuxtLink to="/dashboard" class="sidebar-link">📊 Dashboard</NuxtLink>
        <NuxtLink to="/dashboard/products" class="sidebar-link">📦 Products</NuxtLink>
        <NuxtLink to="/dashboard/orders" class="sidebar-link">🧾 Orders</NuxtLink>
        <NuxtLink to="/dashboard/users" class="sidebar-link">👥 Users</NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 class="text-lg font-semibold text-gray-700">Admin Panel</h1>
        <button @click="logout" class="text-red-500 hover:underline">Logout</button>
      </header>
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
```

---

### 📅 Day 11 – Products Management (Admin)

#### 11.1 — Admin Product APIs

```typescript
// server/api/admin/products/index.get.ts
export default defineEventHandler(async () => {
  return await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })
})

// server/api/admin/products/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.product.create({ data: body, include: { category: true } })
})

// server/api/admin/products/[id].put.ts
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  return await prisma.product.update({ where: { id }, data: body })
})

// server/api/admin/products/[id].delete.ts
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  await prisma.product.delete({ where: { id } })
  return { success: true }
})
```

---

### 📅 Day 12 – Orders Management

```typescript
// server/api/admin/orders/index.get.ts
export default defineEventHandler(async () => {
  return await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  })
})

// server/api/admin/orders/[id].patch.ts
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { status } = await readBody(event)
  return await prisma.order.update({ where: { id }, data: { status } })
})
```

---

### 📅 Day 13 – Users Management

```typescript
// server/api/admin/users/index.get.ts
export default defineEventHandler(async () => {
  return await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true, _count: { select: { orders: true } } }
  })
})
```

---

## 🛍️ PHASE 6 & 7 — Frontend Store

### 📅 Day 14-15 – UI Components

#### `app/components/ui/Toast.vue`

```vue
<template>
  <Teleport to="body">
    <div v-if="ui.toast" class="fixed bottom-4 right-4 z-50">
      <div :class="['px-6 py-3 rounded-lg text-white shadow-lg', ui.toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">
        {{ ui.toast.message }}
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const ui = useUiStore()
</script>
```

---

### 📅 Day 16 – Products UI

#### `app/pages/index.vue`

```vue
<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">🛍️ Vigo Store</h1>

    <!-- Search & Filter -->
    <div class="flex gap-4 mb-8">
      <input v-model="search" placeholder="Search products..." class="input flex-1" />
      <select v-model="selectedCategory" class="input">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.slug">{{ cat.name }}</option>
      </select>
    </div>

    <!-- Products Grid -->
    <div v-if="pending" class="text-center py-12">Loading...</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard v-for="product in data?.products" :key="product.id" :product="product" />
    </div>

    <!-- Pagination -->
    <div class="flex justify-center gap-2 mt-8">
      <button v-for="p in data?.pagination.totalPages" :key="p"
        @click="page = p"
        :class="['btn', page === p ? 'btn-primary' : 'btn-outline']">
        {{ p }}
      </button>
    </div>
  </div>
</template>

<script setup>
const page = ref(1)
const search = ref('')
const selectedCategory = ref('')

const { data, pending } = useFetch('/api/products', {
  query: { page, search, category: selectedCategory, limit: 12 },
  watch: [page, search, selectedCategory]
})

const { data: categories } = useFetch('/api/categories')
</script>
```

---

### 📅 Day 17 – Cart System

#### `app/stores/cart.ts`

```typescript
import { defineStore } from 'pinia'

interface CartItem {
  id: number
  name: string
  price: number
  image?: string
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),

  getters: {
    total: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    count: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },

  actions: {
    addItem(product: CartItem) {
      const existing = this.items.find(i => i.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    removeItem(id: number) {
      this.items = this.items.filter(i => i.id !== id)
    },
    updateQuantity(id: number, quantity: number) {
      const item = this.items.find(i => i.id === id)
      if (item) item.quantity = Math.max(0, quantity)
      this.items = this.items.filter(i => i.quantity > 0)
    },
    clearCart() {
      this.items = []
    }
  },

  persist: {
    storage: localStorage,
  }
})
```

---

### 📅 Day 18 – Checkout Flow

#### `app/pages/checkout.vue`

```vue
<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Checkout</h1>

    <div v-if="cart.items.length === 0" class="text-center py-12">
      <p class="text-gray-500">Your cart is empty</p>
      <NuxtLink to="/" class="btn btn-primary mt-4">Shop Now</NuxtLink>
    </div>

    <div v-else>
      <!-- Order Summary -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="font-semibold mb-4">Order Summary</h2>
        <div v-for="item in cart.items" :key="item.id" class="flex justify-between py-2 border-b">
          <span>{{ item.name }} x{{ item.quantity }}</span>
          <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
        <div class="flex justify-between font-bold text-lg mt-4">
          <span>Total</span>
          <span>${{ cart.total.toFixed(2) }}</span>
        </div>
      </div>

      <button @click="placeOrder" :disabled="loading" class="btn btn-primary w-full">
        {{ loading ? 'Placing Order...' : 'Place Order' }}
      </button>
    </div>
  </div>
</template>

<script setup>
const cart = useCartStore()
const router = useRouter()
const loading = ref(false)

async function placeOrder() {
  loading.value = true
  try {
    await $fetch('/api/orders', {
      method: 'POST',
      body: { items: cart.items.map(i => ({ productId: i.id, quantity: i.quantity })) }
    })
    cart.clearCart()
    router.push('/order-success')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
```

---

## 🚀 PHASE 8 — Final Testing & Deployment

### 📅 Day 19 – Testing Checklist

#### Full User Flow Test

```bash
# 1. Health Check
curl http://localhost:3000/api/health

# 2. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test User","password":"password123"}'

# 3. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# 4. Get Products
curl "http://localhost:3000/api/products?page=1&limit=12"

# 5. Get Single Product
curl http://localhost:3000/api/products/1

# 6. Place Order (requires token from login)
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":1,"quantity":2}]}'
```

---

## ⚙️ Complete Setup Commands (Run in Order)

```bash
# 1. Create project
npx nuxi@latest init vigo-store && cd vigo-store

# 2. Install dependencies
npm install @pinia/nuxt pinia @nuxtjs/tailwindcss @prisma/client bcrypt jsonwebtoken dotenv
npm install -D prisma tsx typescript @types/node @types/bcrypt @types/jsonwebtoken

# 3. Start database
docker-compose up -d postgres

# 4. Wait for DB to be healthy
docker ps  # Should show "healthy"

# 5. Initialize Prisma
npx prisma init

# 6. Add schema (copy from Day 3 above)
# Edit prisma/schema.prisma

# 7. Run migrations
npx prisma migrate dev --name init

# 8. Generate client
npx prisma generate

# 9. Seed database
npm run db:seed

# 10. Start dev server
npm run dev

# ✅ Visit http://localhost:3000
```

---

## 📋 Prisma Version Note

> هذا المشروع يستخدم **Prisma 6.x (Stable)** — مش 7.x
>
> الفرق الأساسي:
> - Prisma 6: `url = env("DATABASE_URL")` في `schema.prisma` ✅
> - Prisma 7: الـ url اتشال من الـ schema وبقى في `prisma.config.ts` فقط
>
> ```json
> // package.json
> "@prisma/client": "^6.19.3",
> "prisma": "^6.19.3"
> ```

---

*📅 Timeline: 19 يوم | 🛠️ Stack: Nuxt 3 + Prisma 6 + PostgreSQL + Docker*