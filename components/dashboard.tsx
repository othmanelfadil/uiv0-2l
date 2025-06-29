"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Trophy, Zap, Target, BookOpen, Brain, Award, TrendingUp, Clock, Star } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Define types (replace with your actual types)
interface Achievement {
  id: number
  title: string
  description: string
  icon: any // Replace 'any' with the actual type of your icons
  completed: boolean
  xp: number
}

interface LeaderboardEntry {
  rank: number
  name: string
  xp: number
  avatar: string
  isCurrentUser?: boolean
}

interface UserStats {
  currentStreak: number
  xp: number
  level: number
  xpToNextLevel: number
  todaySessions: number
}

// Placeholder for API client (replace with your actual API client)
const apiClient = {
  getUserStats: async (userId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: {
        currentStreak: 5,
        xp: 1250,
        level: 5,
        xpToNextLevel: 250,
        todaySessions: 3,
      },
    }
  },
  getUserAchievements: async (userId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: [
        {
          id: 1,
          title: "First Steps",
          description: "Complete your first chat session",
          icon: Brain,
          completed: true,
          xp: 50,
        },
        {
          id: 2,
          title: "Knowledge Seeker",
          description: "Upload 5 documents",
          icon: BookOpen,
          completed: true,
          xp: 100,
        },
        {
          id: 3,
          title: "Exam Master",
          description: "Generate 10 exams",
          icon: Target,
          completed: false,
          xp: 200,
        },
        {
          id: 4,
          title: "Streak Champion",
          description: "Maintain a 7-day streak",
          icon: Calendar,
          completed: false,
          xp: 300,
        },
        {
          id: 5,
          title: "Flashcard Pro",
          description: "Create 50 flashcards",
          icon: Star,
          completed: false,
          xp: 150,
        },
        {
          id: 6,
          title: "Speed Learner",
          description: "Complete 20 sessions in a day",
          icon: Zap,
          completed: false,
          xp: 250,
        },
      ],
    }
  },
}

export function Dashboard() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        // TODO: Get actual user ID from auth context
        const userId = "current-user-id"

        const [statsResponse, achievementsResponse] = await Promise.all([
          apiClient.getUserStats(userId),
          apiClient.getUserAchievements(userId),
        ])

        if (statsResponse.success) {
          setUserStats(statsResponse.data)
        }

        if (achievementsResponse.success) {
          setAchievements(achievementsResponse.data)
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-navy-900 pt-2 pb-6 px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 dark:text-cream-50 mb-2">Welcome back, John! 👋</h1>
          <p className="text-navy-600 dark:text-cream-300">Ready to continue your learning journey?</p>
        </motion.div>

        {loading ? (
          <div className="animate-pulse">Loading...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-navy-600 dark:text-cream-300">
                    Current Streak
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-navy-600 dark:text-cream-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-navy-900 dark:text-cream-50">
                    {userStats?.currentStreak || 0} days
                  </div>
                  <p className="text-xs text-navy-600 dark:text-cream-300">Keep it up! 🔥</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-navy-600 dark:text-cream-300">Total XP</CardTitle>
                  <Zap className="h-4 w-4 text-navy-600 dark:text-cream-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-navy-900 dark:text-cream-50">
                    {userStats?.xp?.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-navy-600 dark:text-cream-300">Level {userStats?.level}</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-navy-600 dark:text-cream-300">
                    Today's Sessions
                  </CardTitle>
                  <Clock className="h-4 w-4 text-navy-600 dark:text-cream-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-navy-900 dark:text-cream-50">
                    {userStats?.todaySessions || 0}
                  </div>
                  <p className="text-xs text-navy-600 dark:text-cream-300">Great progress!</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-navy-600 dark:text-cream-300">Achievements</CardTitle>
                  <Trophy className="h-4 w-4 text-navy-600 dark:text-cream-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-navy-900 dark:text-cream-50">
                    {achievements.filter((a) => a.completed).length}/{achievements.length}
                  </div>
                  <p className="text-xs text-navy-600 dark:text-cream-300">Unlocked</p>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* XP Progress */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                      <TrendingUp className="h-5 w-5" />
                      Level Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-navy-600 dark:text-cream-300">
                        Level {userStats?.level}
                      </span>
                      <span className="text-sm font-medium text-navy-600 dark:text-cream-300">
                        Level {userStats?.level ? userStats?.level + 1 : 0}
                      </span>
                    </div>
                    <Progress value={(userStats?.xp % 500) / 5} className="h-3" />
                    <p className="text-sm text-navy-600 dark:text-cream-300">
                      {userStats?.xpToNextLevel} XP needed for next level
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants}>
                <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                  <CardHeader>
                    <CardTitle className="text-navy-900 dark:text-cream-50">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-3 text-left rounded-lg bg-navy-50 dark:bg-navy-700 hover:bg-navy-100 dark:hover:bg-navy-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Brain className="h-5 w-5 text-navy-600 dark:text-cream-300" />
                        <span className="text-sm font-medium text-navy-900 dark:text-cream-50">Start Chat Session</span>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-3 text-left rounded-lg bg-navy-50 dark:bg-navy-700 hover:bg-navy-100 dark:hover:bg-navy-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-navy-600 dark:text-cream-300" />
                        <span className="text-sm font-medium text-navy-900 dark:text-cream-50">Generate Exam</span>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-3 text-left rounded-lg bg-navy-50 dark:bg-navy-700 hover:bg-navy-100 dark:hover:bg-navy-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-navy-600 dark:text-cream-300" />
                        <span className="text-sm font-medium text-navy-900 dark:text-cream-50">Create Flashcards</span>
                      </div>
                    </motion.button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Achievements */}
              <motion.div variants={itemVariants}>
                <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                      <Award className="h-5 w-5" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          achievement.completed
                            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                            : "bg-gray-50 dark:bg-navy-700 opacity-60"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            achievement.completed ? "bg-green-100 dark:bg-green-800" : "bg-gray-200 dark:bg-navy-600"
                          }`}
                        >
                          <achievement.icon
                            className={`h-4 w-4 ${
                              achievement.completed
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-400 dark:text-navy-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`text-sm font-medium ${
                              achievement.completed
                                ? "text-navy-900 dark:text-cream-50"
                                : "text-gray-500 dark:text-navy-400"
                            }`}
                          >
                            {achievement.title}
                          </h4>
                          <p
                            className={`text-xs ${
                              achievement.completed
                                ? "text-navy-600 dark:text-cream-300"
                                : "text-gray-400 dark:text-navy-500"
                            }`}
                          >
                            {achievement.description}
                          </p>
                        </div>
                        <Badge variant={achievement.completed ? "default" : "secondary"} className="text-xs">
                          {achievement.xp} XP
                        </Badge>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Leaderboard */}
              <motion.div variants={itemVariants}>
                <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                      <Trophy className="h-5 w-5" />
                      Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* {leaderboardData.map((user, index) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          user.isCurrentUser
                            ? "bg-navy-50 dark:bg-navy-700 border border-navy-200 dark:border-navy-600"
                            : "hover:bg-cream-50 dark:hover:bg-navy-700/50"
                        }`}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-100 dark:bg-navy-600 text-sm font-bold text-navy-900 dark:text-cream-50">
                          {user.rank}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-navy-900 dark:text-cream-50">{user.name}</p>
                          <p className="text-xs text-navy-600 dark:text-cream-300">{user.xp.toLocaleString()} XP</p>
                        </div>
                        {user.rank <= 3 && (
                          <Trophy
                            className={`h-4 w-4 ${
                              user.rank === 1 ? "text-yellow-500" : user.rank === 2 ? "text-gray-400" : "text-amber-600"
                            }`}
                          />
                        )}
                      </motion.div>
                    ))} */}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
