export interface SessionData {
  userId: string
  createdAt: number
  expiresAt: number
  data?: any
}

export interface CreateSessionData {
  userId: string
  data?: any
}