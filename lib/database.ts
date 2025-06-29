// Database schema and connection utilities
// This would be implemented with your chosen database (PostgreSQL, MySQL, etc.)

export interface DatabaseUser {
  id: string
  email: string
  password_hash: string
  name: string
  avatar?: string
  level: number
  xp: number
  current_streak: number
  created_at: Date
  updated_at: Date
}

export interface DatabaseDocument {
  id: string
  user_id: string
  name: string
  type: string
  size: number
  file_path: string
  extracted_text?: string
  summary?: string
  key_points?: string[]
  processed: boolean
  created_at: Date
}

export interface DatabaseExam {
  id: string
  user_id: string
  title: string
  description: string
  content: string
  settings: {
    questions: number
    difficulty: string
    timeLimit: number
    questionTypes: string[]
  }
  questions: any[]
  created_at: Date
}

export interface DatabaseFlashcard {
  id: string
  deck_id: string
  front: string
  back: string
  difficulty: string
  last_reviewed?: Date
  next_review?: Date
  review_count: number
  created_at: Date
}

export interface DatabaseFlashcardDeck {
  id: string
  user_id: string
  title: string
  description: string
  category: string
  created_at: Date
  updated_at: Date
}

export interface DatabaseAchievement {
  id: string
  title: string
  description: string
  icon: string
  xp: number
  rarity: string
  criteria: any
}

export interface DatabaseUserAchievement {
  id: string
  user_id: string
  achievement_id: string
  completed: boolean
  progress?: number
  total?: number
  unlocked_date?: Date
  created_at: Date
}

export interface DatabaseChatMessage {
  id: string
  conversation_id: string
  user_id: string
  content: string
  sender: "user" | "assistant"
  attachments?: string[]
  created_at: Date
}

export interface DatabaseConversation {
  id: string
  user_id: string
  title: string
  created_at: Date
  updated_at: Date
}

// Database connection and query utilities would go here
// Example with Prisma, Drizzle, or raw SQL queries
