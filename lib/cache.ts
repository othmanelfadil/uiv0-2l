// Caching service for performance optimization

export interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

export class CacheService {
  private cache = new Map<string, CacheItem<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    }
    this.cache.set(key, item)
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Cache user data
  setUserData(userId: string, data: any): void {
    this.set(`user:${userId}`, data, 10 * 60 * 1000) // 10 minutes
  }

  getUserData(userId: string): any | null {
    return this.get(`user:${userId}`)
  }

  // Cache achievements
  setAchievements(userId: string, achievements: any[]): void {
    this.set(`achievements:${userId}`, achievements, 15 * 60 * 1000) // 15 minutes
  }

  getAchievements(userId: string): any[] | null {
    return this.get(`achievements:${userId}`)
  }

  // Cache flashcard decks
  setFlashcardDecks(userId: string, decks: any[]): void {
    this.set(`flashcards:${userId}`, decks, 5 * 60 * 1000) // 5 minutes
  }

  getFlashcardDecks(userId: string): any[] | null {
    return this.get(`flashcards:${userId}`)
  }
}

export const cacheService = new CacheService()
