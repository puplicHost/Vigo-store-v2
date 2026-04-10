export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 12
    const search = query.search as string || ''
    const category = query.category as string || ''

    const where = {
      isActive: true,
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
      ...(category && { category: { slug: category } }),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch products' })
  }
})
