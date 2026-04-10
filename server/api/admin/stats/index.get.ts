export default defineEventHandler(async () => {
  const [products, orders, users] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count()
  ])

  return {
    products,
    orders,
    users
  }
})
