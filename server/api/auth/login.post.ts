import bcrypt from 'bcrypt'
import { signToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password required' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role })
  
  return { 
    user: { id: user.id, email: user.email, name: user.name, role: user.role }, 
    token 
  }
})
