export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid product ID' })
  }

  const { name, slug, description, price, stock, categoryId, image, isActive } = body

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(stock !== undefined && { stock: parseInt(stock) }),
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(image !== undefined && { image }),
      ...(isActive !== undefined && { isActive }),
    },
    include: { category: true }
  })

  return product
})
