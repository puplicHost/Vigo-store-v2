export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid product ID' })
  }
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  })
  
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }
  
  return product
})
