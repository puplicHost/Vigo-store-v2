import { verifyToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const protectedRoutes = ['/api/orders', '/api/admin']
  const path = event.node.req.url || ''

  const isProtected = protectedRoutes.some(route => path.startsWith(route))
  if (!isProtected) return

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'No token provided' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    event.context.user = decoded
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})
