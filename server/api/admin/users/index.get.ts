export default defineEventHandler(async () => {
  const users = await prisma.user.findMany({
    select: { 
      id: true, 
      email: true, 
      name: true, 
      role: true, 
      createdAt: true,
      _count: { select: { orders: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  return users
})
