// סטטוסים של לקוח
export type ClientStatus = 'active' | 'new' | 'followup' | 'inactive'

// סוגי פגישות
export type MeetingType = 'assessment' | 'session' | 'followup' | 'consultation'

// סטטוסים של משימה
export type TaskStatus = 'new' | 'inprogress' | 'completed'

// עדיפויות של משימה
export type TaskPriority = 'low' | 'medium' | 'high'

// ========== Clients ==========
export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  startDate: string
  status: ClientStatus
  goals: string[]
  notes: string
  createdAt: string
  updatedAt: string
}

// ========== Meetings ==========
export interface MeetingSummary {
  mainTopic: string
  goals: string[]
  keyPoints: string[]
  whatWasDone: string[]
  nextSteps: string[]
  nextCheckpoints: string[]
  coachNotes: string
}

export interface Meeting {
  id: string
  clientId: string
  date: string
  time: string
  duration: number // בדקות
  type: MeetingType
  location: string // 'online' או כתובת
  summary: MeetingSummary
  createdAt: string
  updatedAt: string
}

// ========== Tasks ==========
export interface Task {
  id: string
  title: string
  clientId?: string
  dueDate: string
  dueTime?: string
  priority: TaskPriority
  status: TaskStatus
  notes: string
  createdAt: string
  updatedAt: string
}

// ========== Knowledge Base ==========
export interface KnowledgeItem {
  id: string
  title: string
  type: 'pdf' | 'document' | 'image' | 'text' | 'exercise'
  content: string // URL או תוכן
  createdAt: string
  updatedAt: string
}

// ========== Conversation ==========
export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  type: 'general' | 'client' | 'knowledge'
  clientId?: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}
