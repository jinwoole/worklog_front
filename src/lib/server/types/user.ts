export interface User {
  id: string
  name: string
  email: string
  lastLoginAt?: bigint | null
  failedAttempts?: number | null
  lockedUntil?: bigint | null
  createdAt?: bigint | null
  updatedAt?: bigint | null
}

export interface CreateUser {
  id: string
  name: string
  email: string
  createdAt?: bigint
  updatedAt?: bigint
}

export interface UpdateUser {
  name?: string
  email?: string
  lastLoginAt?: bigint | null
  failedAttempts?: number | null
  lockedUntil?: bigint | null
  updatedAt?: bigint
}