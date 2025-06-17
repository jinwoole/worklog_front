import { redis } from '$lib/server/db/redis'
import type { SessionData, CreateSessionData } from '$lib/server/types/session'

export class SessionRepository {
  private readonly prefix = 'session:'
  private readonly defaultTTL = 60 * 60 * 24 * 7 // 7일

  async create(sessionId: string, data: CreateSessionData, ttl?: number): Promise<void> {
    const sessionData: SessionData = {
      ...data,
      createdAt: Date.now(),
      expiresAt: Date.now() + (ttl || this.defaultTTL) * 1000
    }
    
    await redis.setEx(
      `${this.prefix}${sessionId}`, 
      ttl || this.defaultTTL, 
      JSON.stringify(sessionData)
    )
  }

  async findById(sessionId: string): Promise<SessionData | null> {
    const data = await redis.get(`${this.prefix}${sessionId}`)
    if (!data) return null
    
    try {
      return JSON.parse(data) as SessionData
    } catch {
      return null
    }
  }

  async update(sessionId: string, data: Partial<SessionData>): Promise<void> {
    const existing = await this.findById(sessionId)
    if (!existing) {
      throw new Error('Session not found')
    }

    const updated = { ...existing, ...data }
    const ttl = await redis.ttl(`${this.prefix}${sessionId}`)
    
    await redis.setEx(
      `${this.prefix}${sessionId}`, 
      ttl > 0 ? ttl : this.defaultTTL, 
      JSON.stringify(updated)
    )
  }

  async delete(sessionId: string): Promise<void> {
    await redis.del(`${this.prefix}${sessionId}`)
  }

  async deleteByUserId(userId: string): Promise<void> {
    // 사용자의 모든 세션 삭제 (로그아웃 올)
    const keys = await redis.keys(`${this.prefix}*`)
    const sessions = await Promise.all(
      keys.map(key => redis.get(key))
    )

    const userSessionKeys = keys.filter((key, index) => {
      try {
        const session = JSON.parse(sessions[index] || '{}')
        return session.userId === userId
      } catch {
        return false
      }
    })

    if (userSessionKeys.length > 0) {
      await redis.del(userSessionKeys)
    }
  }

  async extend(sessionId: string, ttl?: number): Promise<void> {
    await redis.expire(`${this.prefix}${sessionId}`, ttl || this.defaultTTL)
  }
}
