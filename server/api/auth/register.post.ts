import bcrypt from 'bcrypt'
import { signToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, name, password } = body

  if (!email || !name || !password) {
    throw createError({ statusCode: 400, statusMessage: 'All fields required' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, name, password: hashedPassword }
  })

  const token = signToken({ id: user.id, email: user.email, role: user.role })
  
  return { 
    user: { id: user.id, email: user.email, name: user.name, role: user.role }, 
    token 
  }
})
