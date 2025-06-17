import { UserRepository } from '$lib/server/repositories/user.repository'
import type { CreateUser, UpdateUser, User } from '$lib/server/types/user'
import { nanoid } from 'nanoid'

export class UserService {
  public userRepository = new UserRepository()

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email)
  }

  async createUser(data: Omit<CreateUser, 'id'>): Promise<User> {
    const now = BigInt(Date.now())
    const userData: CreateUser = {
      id: nanoid(),
      ...data,
      createdAt: now,
      updatedAt: now
    }

    // 이메일/이름 중복 검사
    const existingUserByEmail = await this.userRepository.findByEmail(userData.email)
    if (existingUserByEmail) {
      throw new Error('Email already exists')
    }

    const existingUserByName = await this.userRepository.findByName(userData.name)
    if (existingUserByName) {
      throw new Error('Username already exists')
    }

    return await this.userRepository.create(userData)
  }

  async createUserWithTx(tx: any, data: Omit<CreateUser, 'id'>): Promise<User> {
    const now = BigInt(Date.now())
    const userData = {
      id: nanoid(),
      name: data.name,
      email: data.email,
      created_at: now,
      updated_at: now
    }

    return await tx.users.create({
      data: userData
    })
  }

  async updateUser(id: string, data: Omit<UpdateUser, 'updatedAt'>): Promise<User> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new Error('User not found')
    }

    // 이메일 변경 시 중복 검사
    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(data.email)
      if (existingUser) {
        throw new Error('Email already exists')
      }
    }

    // 이름 변경 시 중복 검사
    if (data.name && data.name !== user.name) {
      const existingUser = await this.userRepository.findByName(data.name)
      if (existingUser) {
        throw new Error('Username already exists')
      }
    }

    return await this.userRepository.update(id, {
      ...data,
      updatedAt: BigInt(Date.now())
    })
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new Error('User not found')
    }

    await this.userRepository.delete(id)
  }

    isUserLocked(user: User): boolean {
    if (!user.lockedUntil) return false
    return BigInt(Date.now()) < user.lockedUntil
    }

    shouldLockUser(user: User): boolean {
    const maxAttempts = 5
    return (user.failedAttempts ?? 0) >= maxAttempts
    }

      async incrementFailedAttempts(id: string): Promise<User> {
    return await this.userRepository.incrementFailedAttempts(id)
  }

  async resetFailedAttempts(id: string): Promise<User> {
    return await this.userRepository.resetFailedAttempts(id)
  }

  async lockUser(id: string, lockUntil: bigint): Promise<User> {
    return await this.userRepository.lockUser(id, lockUntil)
  }

}