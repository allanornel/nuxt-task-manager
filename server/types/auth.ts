export interface User {
  id: string
  email: string
  name: string
  password: string // hashed
  createdAt: string
}

export interface Session {
  userId: string
  createdAt: string
  expiresAt?: string
}

export type SessionsMap = Record<string, Session>