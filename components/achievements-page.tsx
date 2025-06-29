"use client"

import { motion } from "framer-motion"
import { Trophy, Star, Target, Zap, BookOpen, Brain, Calendar, Award, Medal, Crown, Flame } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api"

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  xp: number
  rarity: string
}

interface UserAchievement {
  id: string
  achievementId: string
  userId: string
  completed: boolean
  unlockedDate?: string
  progress?: number
  total?: number
}

const predefinedAchievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Complete your first chat session",
    icon: Brain,
    xp: 50,
    rarity: "common",
  },
  {
    id: 2,
    title: "Knowledge Seeker",
    description: "Upload 5 documents",
    icon: BookOpen,
    xp: 100,
    rarity: "common",
  },
  {
    id: 3,
    title: "Exam Master",
    description: "Generate 10 exams",
    icon: Target,
    xp: 200,
    rarity: "rare",
  },
  {
    id: 4,
    title: "Streak Champion",
    description: "Maintain a 7-day streak",
    icon: Calendar,
    xp: 300,
    rarity: "rare",
  },
  {
    id: 5,
    title: "Flashcard Pro",
    description: "Create 50 flashcards",
    icon: Star,
    xp: 150,
    rarity: "uncommon",
  },
  {
    id: 6,
    title: "Speed Learner",
    description: "Complete 20 sessions in a day",
    icon: Zap,
    xp: 250,
    rarity: "rare",
  },
  {
    id: 7,
    title: "Scholar",
    description: "Reach level 10",
    icon: Award,
    xp: 500,
    rarity: "epic",
  },
  {
    id: 8,
    title: "Perfectionist",
    description: "Score 100% on 5 exams",
    icon: Medal,
    xp: 400,
    rarity: "epic",
  },
  {
    id: 9,
    title: "Legend",
    description: "Reach 10,000 XP",
    icon: Crown,
    xp: 1000,
    rarity: "legendary",
  },
]

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(predefinedAchievements)
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true)
        // TODO: Get actual user ID from auth context
        const userId = "current-user-id"

        const response = await apiClient.getUserAchievements(userId)
        if (response.success) {
          setUserAchievements(response.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch achievements:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "uncommon":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
      case "rare":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
      case "epic":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const completedAchievements = userAchievements.filter((ua) => ua.completed)
  const totalXP = completedAchievements.reduce((sum, ua) => {
    const achievement = achievements.find((a) => a.id === ua.achievementId)
    return sum + (achievement?.xp || 0)
  }, 0)

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
    <div className="min-h-screen bg-cream-50 dark:bg-navy-900 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-6"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-cream-50 mb-2">Achievements</h1>
          <p className="text-navy-600 dark:text-cream-300">Track your learning milestones and unlock rewards</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy-600 dark:text-cream-300">Unlocked</CardTitle>
              <Trophy className="h-4 w-4 text-navy-600 dark:text-cream-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy-900 dark:text-cream-50">
                {completedAchievements.length}/{achievements.length}
              </div>
              <p className="text-xs text-navy-600 dark:text-cream-300">Achievements</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy-600 dark:text-cream-300">Total XP</CardTitle>
              <Zap className="h-4 w-4 text-navy-600 dark:text-cream-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy-900 dark:text-cream-50">{totalXP.toLocaleString()}</div>
              <p className="text-xs text-navy-600 dark:text-cream-300">From achievements</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy-600 dark:text-cream-300">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-navy-600 dark:text-cream-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy-900 dark:text-cream-50">
                {Math.round((completedAchievements.length / achievements.length) * 100)}%
              </div>
              <p className="text-xs text-navy-600 dark:text-cream-300">Overall progress</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                <Crown className="h-5 w-5" />
                Rarest Badge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy-900 dark:text-cream-50">Rare</div>
              <p className="text-xs text-navy-600 dark:text-cream-300">Highest unlocked</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievement Grid */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                <Award className="h-5 w-5" />
                All Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
                  ))}
                </div>
              ) : userAchievements.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-navy-300 dark:text-cream-600" />
                  <p className="text-navy-600 dark:text-cream-400">No achievements yet</p>
                  <p className="text-sm text-navy-500 dark:text-cream-500 mt-2">
                    Start learning to unlock achievements
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userAchievements.map((userAchievement, index) => {
                    const achievement = achievements.find((a) => a.id === userAchievement.achievementId)

                    if (!achievement) {
                      return null // Skip if achievement data is not found
                    }

                    return (
                      <motion.div
                        key={userAchievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`relative overflow-hidden rounded-lg border transition-all ${
                          userAchievement.completed
                            ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 shadow-md"
                            : "bg-gray-50 dark:bg-navy-700 border-gray-200 dark:border-navy-600 opacity-75"
                        }`}
                      >
                        {userAchievement.completed && (
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <Trophy className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}

                        <div className="p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                userAchievement.completed
                                  ? "bg-green-100 dark:bg-green-800"
                                  : "bg-gray-200 dark:bg-navy-600"
                              }`}
                            >
                              <achievement.icon
                                className={`h-5 w-5 ${
                                  userAchievement.completed
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-gray-400 dark:text-navy-400"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`font-semibold text-sm ${
                                  userAchievement.completed
                                    ? "text-navy-900 dark:text-cream-50"
                                    : "text-gray-500 dark:text-navy-400"
                                }`}
                              >
                                {achievement.title}
                              </h3>
                              <p
                                className={`text-xs ${
                                  userAchievement.completed
                                    ? "text-navy-600 dark:text-cream-300"
                                    : "text-gray-400 dark:text-navy-500"
                                }`}
                              >
                                {achievement.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </Badge>
                            <Badge variant={userAchievement.completed ? "default" : "secondary"} className="text-xs">
                              {achievement.xp} XP
                            </Badge>
                          </div>

                          {!userAchievement.completed && userAchievement.progress !== undefined && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-navy-600 dark:text-cream-300">
                                <span>Progress</span>
                                <span>
                                  {userAchievement.progress}/{userAchievement.total}
                                </span>
                              </div>
                              <Progress
                                value={(userAchievement.progress / userAchievement.total) * 100}
                                className="h-1"
                              />
                            </div>
                          )}

                          {userAchievement.completed && userAchievement.unlockedDate && (
                            <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Unlocked {userAchievement.unlockedDate}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                <Flame className="h-5 w-5" />
                Recent Unlocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedAchievements
                  .slice(-3)
                  .reverse()
                  .map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-cream-50 dark:bg-navy-700"
                    >
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800">
                        <achievement.icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-navy-900 dark:text-cream-50">{achievement.title}</h4>
                        <p className="text-xs text-navy-600 dark:text-cream-300">Unlocked {achievement.unlockedDate}</p>
                      </div>
                      <Badge variant="default" className="text-xs">
                        +{achievement.xp} XP
                      </Badge>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Keep default export for flexibility
export default AchievementsPage

// NEW: Named export expected by <app>/achievements/page.tsx
export { AchievementsPage }
