export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { items } = body // [{ productId, quantity }]

  if (!items?.length) {
    throw createError({ statusCode: 400, statusMessage: 'Cart is empty' })
  }

  // Fetch products and calculate total
  const productIds = items.map((i: any) => i.productId)
  const products = await prisma.product.findMany({ 
    where: { id: { in: productIds } } 
  })

  let total = 0
  const orderItems = items.map((item: any) => {
    const product = products.find(p => p.id === item.productId)
    if (!product) {
      throw createError({ statusCode: 404, statusMessage: `Product ${item.productId} not found` })
    }
    if (product.stock < item.quantity) {
      throw createError({ statusCode: 400, statusMessage: `Insufficient stock for ${product.name}` })
    }
    total += product.price * item.quantity
    return { productId: item.productId, quantity: item.quantity, price: product.price }
  })

  // Create order and update stock in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Update stock for each product
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })
    }

    // Create the order
    return await tx.order.create({
      data: {
        userId: user.id,
        total,
        items: { create: orderItems }
      },
      include: { items: { include: { product: true } }, user: true }
    })
  })

  return order
})
