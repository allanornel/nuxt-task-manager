import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import type { User, SessionsMap, Task } from '../types/auth'
import { CreateTaskDTO } from '../types/task'

const usersPath = path.join(process.cwd(), 'server', 'db', 'users.json')
const sessionsPath = path.join(process.cwd(), 'server', 'db', 'sessions.json')
const tasksPath = path.join(process.cwd(), 'server', 'db', 'tasks.json')

const DEFAULT_SESSION_TTL = 60 * 60 * 24 * 7 // 7 days in seconds
const BCRYPT_SALT_ROUNDS = 10

async function ensureFiles() {
  const dir = path.dirname(usersPath)
  await fs.mkdir(dir, { recursive: true })
  try { await fs.access(usersPath) } catch { await fs.writeFile(usersPath, '[]', 'utf8') }
  try { await fs.access(sessionsPath) } catch { await fs.writeFile(sessionsPath, '{}', 'utf8') }
  try { await fs.access(tasksPath) } catch { await fs.writeFile(tasksPath, '[]', 'utf8') }
}

async function readJson<T = unknown>(file: string): Promise<T> {
  await ensureFiles()
  const txt = await fs.readFile(file, 'utf8')
  return JSON.parse(txt) as T
}

async function writeJson<T = unknown>(file: string, data: T) {
  await ensureFiles()
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8')
}

export async function getUsers(): Promise<User[]> {
  return readJson<User[]>(usersPath)
}

export async function saveUsers(users: User[]) {
  return writeJson(usersPath, users)
}

export async function getSessions(): Promise<SessionsMap> {
  return readJson<SessionsMap>(sessionsPath)
}

export async function saveSessions(sessions: SessionsMap) {
  return writeJson(sessionsPath, sessions)
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
}

export async function comparePassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed)
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers()
  return users.find((u) => u.email === email) || null
}

export async function addUser(user: User) {
  const users = await getUsers()
  users.push(user)
  await saveUsers(users)
  return user
}

async function pruneExpiredSessions(sessions: SessionsMap) {
  const now = Date.now()
  let changed = false
  for (const [token, s] of Object.entries(sessions)) {
    if (s?.expiresAt && Date.parse(s.expiresAt) <= now) {
      Reflect.deleteProperty(sessions, token)
      changed = true
    }
  }
  return changed
}

export async function createSession(userId: string, ttlSeconds = DEFAULT_SESSION_TTL) {
  const sessions = await getSessions()
  // prune expired first
  const changed = await pruneExpiredSessions(sessions)
  if (changed) await saveSessions(sessions)

  const token = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex')
  const now = Date.now()
  const expiresAt = new Date(now + ttlSeconds * 1000).toISOString()
  sessions[token] = { userId, createdAt: new Date(now).toISOString(), expiresAt }
  await saveSessions(sessions)
  return { token, expiresAt }
}

export async function getUserIdFromSession(token?: string | null, refresh = true): Promise<string | null> {
  if (!token) return null
  const sessions = await getSessions()
  const s = sessions[token]
  if (!s) return null
  const now = Date.now()
  if (s.expiresAt && Date.parse(s.expiresAt) <= now) {
    // expired, clean up
    Reflect.deleteProperty(sessions, token)
    await saveSessions(sessions)
    return null
  }
  // refresh sliding session expiry on access
  if (refresh) {
    const newExpiresAt = new Date(now + DEFAULT_SESSION_TTL * 1000).toISOString()
    sessions[token].expiresAt = newExpiresAt
    await saveSessions(sessions)
  }
  return s.userId
}

export async function deleteSession(token: string) {
  const sessions = await getSessions()
  if (sessions[token]) {
    Reflect.deleteProperty(sessions, token)
    await saveSessions(sessions)
  }
}

async function getTasks(): Promise<Task[]> {
  return readJson<Task[]>(tasksPath)
}

async function saveTasks(tasks: Task[]) {
  return writeJson(tasksPath, tasks)
}

export async function getTasksByUser(userId: string): Promise<Task[]> {
  const tasks: Task[] = await getTasks()
  return tasks.filter((task) => task.userId === userId)
}

export async function addTask(task: CreateTaskDTO, userId: string): Promise<void> {
  const tasks = await getTasks()
  tasks.push({ ...task, userId, id: crypto.randomUUID(), createdAt: new Date().toISOString(), completed: false })
  await saveTasks(tasks)
}

export async function updateTask(updatedTask: Task) {
  const tasks = await getTasks()
  const index = tasks.findIndex((t) => t.id === updatedTask.id)
  if (index !== -1) {
    tasks[index] = updatedTask
    await saveTasks(tasks)
  }
}
