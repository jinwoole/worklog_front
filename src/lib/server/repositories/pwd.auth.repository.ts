import { prisma } from '$lib/server/db'
import type { CreatePasswordAuth, PasswordAuth } from '$lib/server/types/auth'

export class AuthRepository {
  async findPasswordAuthByUserId(userId: string): Promise<PasswordAuth | null> {
    const result = await prisma.password_auth.findUnique({
      where: { user_id: userId }
    })
    
    if (!result) return null
    
    return {
      userId: result.user_id,
      passwordHash: result.password_hash,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }
  }

  async createPasswordAuth(data: CreatePasswordAuth): Promise<PasswordAuth> {
    const result = await prisma.password_auth.create({
      data: {
        user_id: data.userId,
        password_hash: data.passwordHash,
        created_at: data.createdAt,
        updated_at: data.updatedAt
      }
    })
    
    return {
      userId: result.user_id,
      passwordHash: result.password_hash,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }
  }

  async createPasswordAuthWithTx(tx: any, data: CreatePasswordAuth): Promise<PasswordAuth> {
    const result = await tx.password_auth.create({
      data: {
        user_id: data.userId,
        password_hash: data.passwordHash,
        created_at: data.createdAt,
        updated_at: data.updatedAt
      }
    })
    
    return {
      userId: result.user_id,
      passwordHash: result.password_hash,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }
  }

  async updatePasswordHash(userId: string, passwordHash: string): Promise<PasswordAuth> {
    const result = await prisma.password_auth.update({
      where: { user_id: userId },
      data: {
        password_hash: passwordHash,
        updated_at: BigInt(Date.now())
      }
    })
    
    return {
      userId: result.user_id,
      passwordHash: result.password_hash,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }
  }

  async deletePasswordAuth(userId: string): Promise<void> {
    await prisma.password_auth.delete({
      where: { user_id: userId }
    })
  }
}