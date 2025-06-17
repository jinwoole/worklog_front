import { PrismaClient } from '@prisma/client'

// 전역 변수로 PrismaClient 인스턴스 관리 (개발 환경에서 HMR 대응)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// PrismaClient 인스턴스 생성 (싱글톤 패턴)
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'], // 개발 시 쿼리 로그 확인용
})

// 개발 환경에서만 전역에 저장 (Hot Reload 시 중복 연결 방지)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// 앱 종료 시 연결 해제
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})