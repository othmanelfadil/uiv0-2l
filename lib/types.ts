// Clean type definitions without sample data

export interface User {
  id: string
  name: string
  email: string
  level: number
  xp: number
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  attachments?: string[]
  conversationId: string
}

export interface Conversation {
  id: string
  userId: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages: ChatMessage[]
}

export interface ExamQuestion {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer" | "essay"
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation?: string
  points: number
}

export interface Exam {
  id: string
  userId: string
  title: string
  description: string
  questions: ExamQuestion[]
  timeLimit: number
  difficulty: "easy" | "medium" | "hard"
  createdAt: Date
  updatedAt: Date
}

export interface ExamResult {
  id: string
  examId: string
  userId: string
  score: number
  totalPoints: number
  timeSpent: number
  answers: Record<string, any>
  completedAt: Date
}

export interface Flashcard {
  id: string
  front: string
  back: string
  difficulty: "easy" | "medium" | "hard"
  deckId: string
  lastReviewed?: Date
  nextReview?: Date
  reviewCount: number
  easeFactor: number
  interval: number
}

export interface FlashcardDeck {
  id: string
  userId: string
  title: string
  description: string
  cards: Flashcard[]
  createdAt: Date
  updatedAt: Date
  lastStudied?: Date
  progress: number
}

export interface Document {
  id: string
  userId: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
  processed: boolean
  extractedText?: string
  summary?: string
  keyPoints?: string[]
  metadata?: Record<string, any>
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xp: number
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  criteria: Record<string, any>
  createdAt: Date
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  completed: boolean
  progress: number
  total: number
  unlockedAt?: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "achievement" | "system" | "reminder"
  read: boolean
  createdAt: Date
  data?: Record<string, any>
}

export interface UserStats {
  userId: string
  level: number
  xp: number
  currentStreak: number
  longestStreak: number
  totalSessions: number
  totalStudyTime: number
  totalDocuments: number
  totalExams: number
  totalFlashcards: number
  averageScore: number
  lastActive: Date
  updatedAt: Date
}

export interface LearningSession {
  id: string
  userId: string
  type: "chat" | "exam" | "flashcard" | "document"
  duration: number
  xpGained: number
  startedAt: Date
  completedAt: Date
  metadata?: Record<string, any>
}
