// WebSocket service for real-time features

export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: Date
}

export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(userId: string) {
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"
      this.ws = new WebSocket(`${wsUrl}?userId=${userId}`)

      this.ws.onopen = () => {
        console.log("WebSocket connected")
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      this.ws.onclose = () => {
        console.log("WebSocket disconnected")
        this.attemptReconnect(userId)
      }

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error)
      }
    } catch (error) {
      console.error("Failed to connect WebSocket:", error)
    }
  }

  private attemptReconnect(userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect(userId)
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case "achievement_unlocked":
        // Handle achievement notification
        this.showAchievementNotification(message.payload)
        break
      case "chat_message":
        // Handle real-time chat message
        this.handleChatMessage(message.payload)
        break
      case "exam_completed":
        // Handle exam completion notification
        this.handleExamCompletion(message.payload)
        break
      default:
        console.log("Unknown message type:", message.type)
    }
  }

  private showAchievementNotification(achievement: any) {
    // Trigger achievement notification in UI
    console.log("Achievement unlocked:", achievement)
  }

  private handleChatMessage(message: any) {
    // Update chat interface with new message
    console.log("New chat message:", message)
  }

  private handleExamCompletion(result: any) {
    // Handle exam completion
    console.log("Exam completed:", result)
  }

  sendMessage(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        payload,
        timestamp: new Date(),
      }
      this.ws.send(JSON.stringify(message))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export const wsService = new WebSocketService()
