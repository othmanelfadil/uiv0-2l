// Analytics and tracking service

export interface AnalyticsEvent {
  event: string
  userId?: string
  properties?: Record<string, any>
  timestamp: Date
}

export class AnalyticsService {
  private events: AnalyticsEvent[] = []
  private batchSize = 10
  private flushInterval = 30000 // 30 seconds

  constructor() {
    // Set up periodic flushing
    setInterval(() => {
      this.flush()
    }, this.flushInterval)
  }

  track(event: string, properties?: Record<string, any>, userId?: string): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      userId,
      properties,
      timestamp: new Date(),
    }

    this.events.push(analyticsEvent)

    if (this.events.length >= this.batchSize) {
      this.flush()
    }
  }

  private async flush(): Promise<void> {
    if (this.events.length === 0) return

    const eventsToSend = [...this.events]
    this.events = []

    try {
      // Send to analytics service (e.g., Mixpanel, Amplitude, Google Analytics)
      await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events: eventsToSend }),
      })
    } catch (error) {
      console.error("Failed to send analytics events:", error)
      // Re-add events to queue for retry
      this.events.unshift(...eventsToSend)
    }
  }

  // Predefined tracking methods
  trackPageView(page: string, userId?: string): void {
    this.track("page_view", { page }, userId)
  }

  trackChatMessage(messageLength: number, userId?: string): void {
    this.track("chat_message_sent", { messageLength }, userId)
  }

  trackExamGenerated(settings: any, userId?: string): void {
    this.track("exam_generated", settings, userId)
  }

  trackFlashcardCreated(deckId: string, userId?: string): void {
    this.track("flashcard_created", { deckId }, userId)
  }

  trackAchievementUnlocked(achievementId: string, userId?: string): void {
    this.track("achievement_unlocked", { achievementId }, userId)
  }

  trackDocumentUploaded(fileType: string, fileSize: number, userId?: string): void {
    this.track("document_uploaded", { fileType, fileSize }, userId)
  }
}

export const analytics = new AnalyticsService()
