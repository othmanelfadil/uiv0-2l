// Clean API client without sample data

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: any[]
}

export class ApiClient {
  private baseUrl = "/api"

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()
      return data
    } catch (error) {
      return {
        success: false,
        message: "Network error occurred",
      }
    }
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    return this.request(url.pathname + url.search)
  }

  async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async uploadFile<T>(endpoint: string, file: File): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append("file", file)

    return this.request(endpoint, {
      method: "POST",
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    })
  }

  // Authentication
  async login(email: string, password: string) {
    return this.post("/auth", { email, password, action: "login" })
  }

  async register(email: string, password: string) {
    return this.post("/auth", { email, password, action: "register" })
  }

  // Chat
  async sendChatMessage(message: string, attachments?: File[], conversationId?: string) {
    return this.post("/chat", { message, attachments, conversationId })
  }

  async getChatHistory(conversationId?: string) {
    return this.get("/chat", conversationId ? { conversationId } : undefined)
  }

  // Exams
  async generateExam(content: string, settings: any) {
    return this.post("/exams", { content, settings })
  }

  async getUserExams(userId: string) {
    return this.get("/exams", { userId })
  }

  // Flashcards
  async generateFlashcards(content: string, settings: any) {
    return this.post("/flashcards", { content, settings })
  }

  async getFlashcardDecks(userId: string) {
    return this.get("/flashcards", { userId })
  }

  // Documents
  async uploadDocument(file: File) {
    return this.uploadFile("/documents", file)
  }

  async getUserDocuments(userId: string) {
    return this.get("/documents", { userId })
  }

  // Achievements
  async getUserAchievements(userId: string) {
    return this.get("/achievements", { userId })
  }

  async unlockAchievement(achievementId: string, userId: string) {
    return this.post("/achievements", { achievementId, userId })
  }

  // Notifications
  async getNotifications(userId: string) {
    return this.get("/notifications", { userId })
  }

  async markNotificationAsRead(notificationId: string) {
    return this.patch("/notifications", { notificationId, read: true })
  }

  // User Stats
  async getUserStats(userId: string) {
    return this.get("/user/stats", { userId })
  }
}

export const apiClient = new ApiClient()
