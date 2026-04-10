export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { status } = await readBody(event)

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid order ID' })
  }

  if (!status) {
    throw createError({ statusCode: 400, statusMessage: 'Status is required' })
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { 
      user: { select: { id: true, email: true, name: true } },
      items: { include: { product: true } }
    }
  })

  return order
})
