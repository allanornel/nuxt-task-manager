export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  completed: boolean
  createdAt: string
  updatedAt?: string
}

export interface CreateTaskDTO {
    title: string
    description?: string
}