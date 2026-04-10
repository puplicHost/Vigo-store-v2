export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid product ID' })
  }

  await prisma.product.delete({ where: { id } })
  return { success: true, message: 'Product deleted' }
})
