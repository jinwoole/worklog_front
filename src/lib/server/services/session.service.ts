import { SessionRepository } from '$lib/server/repositories/session.repository'
import { UserService } from './user.service'
import type { SessionData, CreateSessionData } from '$lib/server/types/session'
import type { User } from '$lib/server/types/user'
import { nanoid } from 'nanoid'

export class SessionService {
  private sessionRepository = new SessionRepository()
  private userService = new UserService()

  async createSession(userId: string, sessionData?: any): Promise<string> {
    const sessionId = nanoid()
    const createData: CreateSessionData = {
      userId,
      data: sessionData
    }

    await this.sessionRepository.create(sessionId, createData)
    return sessionId
  }

  async validateSession(sessionId: string): Promise<SessionData | null> {
    if (!sessionId) return null

    const session = await this.sessionRepository.findById(sessionId)
    if (!session) return null

    // 만료 시간 체크
    if (Date.now() > session.expiresAt) {
      await this.sessionRepository.delete(sessionId)
      return null
    }

    return session
  }

  async getCurrentUser(sessionId: string): Promise<User | null> {
    const session = await this.validateSession(sessionId)
    if (!session) return null

    return await this.userService.getUserById(session.userId)
  }

  async extendSession(sessionId: string, ttl?: number): Promise<boolean> {
    const session = await this.validateSession(sessionId)
    if (!session) return false

    await this.sessionRepository.extend(sessionId, ttl)
    return true
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await this.sessionRepository.delete(sessionId)
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    await this.sessionRepository.deleteByUserId(userId)
  }

  async updateSessionData(sessionId: string, data: any): Promise<boolean> {
    const session = await this.validateSession(sessionId)
    if (!session) return false

    await this.sessionRepository.update(sessionId, { data })
    return true
  }

  async refreshSession(sessionId: string): Promise<string | null> {
    const session = await this.validateSession(sessionId)
    if (!session) return null

    // 기존 세션 삭제
    await this.sessionRepository.delete(sessionId)
    
    // 새 세션 생성
    const newSessionId = await this.createSession(session.userId, session.data)
    return newSessionId
  }
}