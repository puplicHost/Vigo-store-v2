export default defineEventHandler(async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    return categories
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch categories' })
  }
})
