"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  level: number
  xp: number
  currentStreak: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          // For now, we'll simulate a successful auth check
          // In a real app, you'd validate the token with your backend
          const mockUser: User = {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            level: 5,
            xp: 1250,
            currentStreak: 5,
          }
          setUser(mockUser)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("auth_token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For demo purposes, accept any email/password combination
      // In production, this would call your actual API
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: "1",
            name: email.split("@")[0],
            email,
            level: 5,
            xp: 1250,
            currentStreak: 5,
          },
          token: "mock-jwt-token-" + Date.now(),
        },
      }

      if (mockResponse.success) {
        setUser(mockResponse.data.user)
        localStorage.setItem("auth_token", mockResponse.data.token)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // For demo purposes, accept any registration
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: "2",
            name,
            email,
            level: 1,
            xp: 0,
            currentStreak: 0,
          },
          token: "mock-jwt-token-" + Date.now(),
        },
      }

      if (mockResponse.success) {
        setUser(mockResponse.data.user)
        localStorage.setItem("auth_token", mockResponse.data.token)
        return true
      }
      return false
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_token")
    window.location.href = "/login"
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
