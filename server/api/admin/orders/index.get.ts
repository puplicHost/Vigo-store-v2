export default defineEventHandler(async () => {
  const orders = await prisma.order.findMany({
    include: { 
      user: { select: { id: true, email: true, name: true } },
      items: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  return orders
})
