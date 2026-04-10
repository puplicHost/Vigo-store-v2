export default defineEventHandler(async (event) => {
  const path = event.node.req.url || ''
  if (!path.startsWith('/api/admin')) return

  const user = event.context.user
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }
})
