import { PrismaClient } from '@prisma/client'

declare global {
  var __prismaClient: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
    datasourceUrl: process.env.DATABASE_URL,
  })
}

export const prisma = global.__prismaClient ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.__prismaClient = prisma
}
