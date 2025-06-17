export interface PasswordAuth {
  userId: string
  passwordHash: string
  createdAt?: bigint | null
  updatedAt?: bigint | null
}

export interface CreatePasswordAuth {
  userId: string
  passwordHash: string
  createdAt?: bigint
  updatedAt?: bigint
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}