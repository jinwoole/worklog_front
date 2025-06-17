import { prisma } from '$lib/server/db'
import type { CreateUser, UpdateUser, User } from '$lib/server/types/user'

export class UserRepository {


  async findById(id: string): Promise<User | null> {
    return await prisma.users.findUnique({
      where: { id }
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.users.findUnique({
      where: { email }
    })
  }

  async findByName(name: string): Promise<User | null> {
    return await prisma.users.findUnique({
      where: { name }
    })
  }

  async create(data: CreateUser): Promise<User> {
    return await prisma.users.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        created_at: data.createdAt,
        updated_at: data.updatedAt
      }
    })
  }

  async update(id: string, data: UpdateUser): Promise<User> {
    const updateData: any = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.lastLoginAt !== undefined) updateData.last_login_at = data.lastLoginAt
    if (data.failedAttempts !== undefined) updateData.failed_attempts = data.failedAttempts
    if (data.lockedUntil !== undefined) updateData.locked_until = data.lockedUntil
    if (data.updatedAt !== undefined) updateData.updated_at = data.updatedAt
    
    return await prisma.users.update({
      where: { id },
      data: updateData
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.users.delete({
      where: { id }
    })
  }

  async incrementFailedAttempts(id: string): Promise<User> {
    return await prisma.users.update({
      where: { id },
      data: {
        failed_attempts: {
          increment: 1
        },
        updated_at: BigInt(Date.now())
      }
    })
  }

  async resetFailedAttempts(id: string): Promise<User> {
    return await prisma.users.update({
      where: { id },
      data: {
        failed_attempts: 0,
        locked_until: null,
        last_login_at: BigInt(Date.now()),
        updated_at: BigInt(Date.now())
      }
    })
  }

  async lockUser(id: string, lockUntil: bigint): Promise<User> {
    return await prisma.users.update({
      where: { id },
      data: {
        locked_until: lockUntil,
        updated_at: BigInt(Date.now())
      }
    })
  }
}