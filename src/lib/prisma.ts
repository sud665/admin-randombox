// Prisma 클라이언트 - DATABASE_URL이 설정된 경우에만 사용
// Mock 모드에서는 사용되지 않음

let prisma: any = null

if (process.env.DATABASE_URL) {
  const { PrismaClient } = require('@prisma/client')
  const globalForPrisma = globalThis as unknown as { prisma: any }
  prisma = globalForPrisma.prisma || new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
}

export { prisma }
