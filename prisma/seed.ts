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
  console.log('Admin user created: admin@vigo.com')

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
  console.log('Categories created: 4')

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
  console.log('Products created: 3')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
