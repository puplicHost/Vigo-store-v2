export default defineEventHandler(async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    return categories
  } catch (error: any) {
    console.error('FULL ERROR in /api/categories:', error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Failed to fetch categories',
      data: { error: error?.message || 'Unknown error' }
    })
  }
})
