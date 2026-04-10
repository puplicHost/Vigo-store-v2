export default defineEventHandler(async () => {
  const start = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    return {
      status: 'healthy',
      database: {
        connected: true,
        latency: `${Date.now() - start}ms`
      }
    }
  } catch {
    return { status: 'unhealthy', database: { connected: false } }
  }
})
