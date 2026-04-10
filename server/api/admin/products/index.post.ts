export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, slug, description, price, stock, categoryId, image, isActive } = body

  if (!name || !slug || !price || !categoryId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      categoryId: parseInt(categoryId),
      image,
      isActive: isActive !== false
    },
    include: { category: true }
  })

  return product
})
