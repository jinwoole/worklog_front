import bcrypt from 'bcrypt'
import { prisma } from '$lib/server/db'
import { UserService } from './user.service'
import { SessionService } from './session.service'
import { AuthRepository } from '$lib/server/repositories/pwd.auth.repository'
import type { LoginRequest, RegisterRequest } from '$lib/server/types/auth'
import type { User } from '$lib/server/types/user'

export class AuthService {
  private userService = new UserService()
  private sessionService = new SessionService()
  private authRepository = new AuthRepository()
  private readonly saltRounds = 12
  private readonly lockDurationMs = 15 * 60 * 1000 // 15분

  async register(data: RegisterRequest): Promise<{ user: User; sessionId: string }> {
    // 트랜잭션으로 사용자 생성과 패스워드 생성을 묶어서 처리
    const result = await prisma.$transaction(async (tx) => {
      // 이메일/이름 중복 검사
      const existingUserByEmail = await tx.users.findUnique({
        where: { email: data.email }
      })
      if (existingUserByEmail) {
        throw new Error('Email already exists')
      }

      const existingUserByName = await tx.users.findUnique({
        where: { name: data.name }
      })
      if (existingUserByName) {
        throw new Error('Username already exists')
      }

      // 사용자 생성
      const user = await this.userService.createUserWithTx(tx, {
        name: data.name,
        email: data.email
      })

      // 패스워드 해시 생성 및 저장
      const passwordHash = await bcrypt.hash(data.password, this.saltRounds)
      const now = BigInt(Date.now())

      await this.authRepository.createPasswordAuthWithTx(tx, {
        userId: user.id,
        passwordHash,
        createdAt: now,
        updatedAt: now
      })

      return user
    })

    // 회원가입 성공 시 자동 로그인 (세션 생성)
    const sessionId = await this.sessionService.createSession(result.id)

    return { user: result, sessionId }
  }

  async login(data: LoginRequest): Promise<{ user: User; sessionId: string }> {
    // 사용자 조회
    const user = await this.userService.getUserByEmail(data.email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // 계정 잠금 확인
    if (this.userService.isUserLocked(user)) {
      throw new Error('Account is temporarily locked. Please try again later.')
    }

    // 패스워드 인증 정보 조회
    const passwordAuth = await this.authRepository.findPasswordAuthByUserId(user.id)
    if (!passwordAuth) {
      throw new Error('Invalid credentials')
    }

    // 패스워드 검증
    const isValidPassword = await bcrypt.compare(data.password, passwordAuth.passwordHash)
    
    if (!isValidPassword) {
      // 실패 횟수 증가
      await this.userService.incrementFailedAttempts(user.id)
      
      // 잠금 여부 확인
      const updatedUser = await this.userService.getUserById(user.id)
      if (updatedUser && this.userService.shouldLockUser(updatedUser)) {
        const lockUntil = BigInt(Date.now() + this.lockDurationMs)
        await this.userService.lockUser(user.id, lockUntil)
      }
      
      throw new Error('Invalid credentials')
    }

    // 로그인 성공 시 실패 횟수 초기화
    const loggedInUser = await this.userService.resetFailedAttempts(user.id)
    
    // 세션 생성
    const sessionId = await this.sessionService.createSession(loggedInUser.id, {
      loginTime: Date.now(),
      userAgent: null // 나중에 요청에서 가져올 수 있음
    })

    return { user: loggedInUser, sessionId }
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessionService.invalidateSession(sessionId)
  }

  async logoutAll(userId: string): Promise<void> {
    await this.sessionService.invalidateAllUserSessions(userId)
  }

  async getCurrentUser(sessionId: string): Promise<User | null> {
    return await this.sessionService.getCurrentUser(sessionId)
  }

  async validateSession(sessionId: string): Promise<boolean> {
    const session = await this.sessionService.validateSession(sessionId)
    return session !== null
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userService.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const passwordAuth = await this.authRepository.findPasswordAuthByUserId(userId)
    if (!passwordAuth) {
      throw new Error('Password authentication not found')
    }

    // 현재 패스워드 확인
    const isValidPassword = await bcrypt.compare(currentPassword, passwordAuth.passwordHash)
    if (!isValidPassword) {
      throw new Error('Invalid current password')
    }

    // 새 패스워드 해시 생성 및 업데이트
    const newPasswordHash = await bcrypt.hash(newPassword, this.saltRounds)
    await this.authRepository.updatePasswordHash(userId, newPasswordHash)

    // 패스워드 변경 시 다른 모든 세션 무효화 (보안)
    await this.sessionService.invalidateAllUserSessions(userId)
  }
}