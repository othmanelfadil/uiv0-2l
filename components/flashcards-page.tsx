"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Plus, Play, RotateCcw, Star, Clock, Target, Zap, ChevronLeft, ChevronRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Flashcard {
  id: string
  front: string
  back: string
  difficulty: "easy" | "medium" | "hard"
  lastReviewed?: Date
  nextReview?: Date
}

interface FlashcardDeck {
  id: string
  title: string
  description: string
  category: string
  cards: Flashcard[]
  createdAt: Date
  updatedAt: Date
  userId: string
}

const apiClient = {
  getFlashcardDecks: async (userId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: [
        {
          id: "deck1",
          title: "Biology - Cell Structure",
          description: "Learn about cell structure",
          category: "Biology",
          cards: [
            {
              id: "1",
              front: "What is photosynthesis?",
              back: "The process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.",
              difficulty: "medium",
            },
            {
              id: "2",
              front: "Define mitochondria",
              back: "The powerhouse of the cell, responsible for producing ATP through cellular respiration.",
              difficulty: "easy",
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: userId,
        },
        {
          id: "deck2",
          title: "History - World War II",
          description: "Learn about World War II",
          category: "History",
          cards: [
            {
              id: "3",
              front: "What was the date of Pearl Harbor?",
              back: "December 7, 1941",
              difficulty: "medium",
            },
            {
              id: "4",
              front: "Who were the major Allied powers?",
              back: "United States, Great Britain, Soviet Union",
              difficulty: "easy",
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: userId,
        },
      ],
    }
  },
}

export function FlashcardsPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyMode, setStudyMode] = useState(false)
  const [studyProgress, setStudyProgress] = useState(0)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [decks, setDecks] = useState<FlashcardDeck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFlashcardData = async () => {
      try {
        setLoading(true)
        // TODO: Get actual user ID from auth context
        const userId = "current-user-id"

        const response = await apiClient.getFlashcardDecks(userId)
        if (response.success) {
          setDecks(response.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch flashcard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFlashcardData()
  }, [])

  const currentCard = flashcards[currentCardIndex]

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
      setStudyProgress(((currentCardIndex + 1) / flashcards.length) * 100)
    }
  }

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
      setStudyProgress(((currentCardIndex - 1) / flashcards.length) * 100)
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }

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

  if (studyMode) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-navy-900 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Study Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStudyMode(false)} className="text-navy-600 dark:text-cream-300">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Flashcards
            </Button>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-navy-900 dark:text-cream-50">Biology Study Session</h2>
              <p className="text-sm text-navy-600 dark:text-cream-300">
                Card {currentCardIndex + 1} of {flashcards.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-navy-600 dark:text-cream-300" />
              <span className="text-sm text-navy-600 dark:text-cream-300">15:30</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={studyProgress} className="h-2" />
            <div className="flex justify-between text-xs text-navy-600 dark:text-cream-300">
              <span>Progress</span>
              <span>{Math.round(studyProgress)}%</span>
            </div>
          </div>

          {/* Flashcard */}
          <div className="flex justify-center">
            <motion.div
              className="relative w-full max-w-2xl h-96 cursor-pointer"
              onClick={flipCard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isFlipped ? "back" : "front"}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Card className="h-full bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700 shadow-lg">
                    <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                      <div className="space-y-4">
                        <Badge
                          variant={
                            currentCard.difficulty === "easy"
                              ? "secondary"
                              : currentCard.difficulty === "medium"
                                ? "default"
                                : "destructive"
                          }
                          className="mb-4"
                        >
                          {currentCard.difficulty}
                        </Badge>
                        <div className="text-lg font-medium text-navy-900 dark:text-cream-50 leading-relaxed">
                          {isFlipped ? currentCard.back : currentCard.front}
                        </div>
                        <div className="text-sm text-navy-600 dark:text-cream-300 mt-8">
                          {isFlipped ? "Click to see question" : "Click to reveal answer"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={prevCard} disabled={currentCardIndex === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button variant="outline" onClick={flipCard}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Flip Card
            </Button>
            <Button onClick={nextCard} disabled={currentCardIndex === flashcards.length - 1}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Difficulty Rating */}
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4"
            >
              <p className="text-sm text-navy-600 dark:text-cream-300">How difficult was this?</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-green-600 bg-transparent">
                  Easy
                </Button>
                <Button variant="outline" size="sm" className="text-yellow-600 bg-transparent">
                  Medium
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                  Hard
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    )
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-navy-900 dark:text-cream-50 mb-2">Flashcards</h1>
              <p className="text-navy-600 dark:text-cream-300">Create and study with AI-generated flashcards</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Deck
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy-600 dark:text-cream-300">Total Decks</CardTitle>
              <BookOpen className="h-4 w-4 text-navy-600 dark:text-cream-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy-900 dark:text-cream-50">{decks.length}</div>
              <p className="text-xs text-navy-600 dark:text-cream-300">+2 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy-600 dark:text-cream-300">Cards Studied</CardTitle>
              <Target className="h-4 w-4 text-navy-600 dark:text-cream-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy-900 dark:text-cream-50">
                {decks.reduce((total, deck) => total + deck.cards.length, 0)}
              </div>
              <p className="text-xs text-navy-600 dark:text-cream-300">+23 today</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy-600 dark:text-cream-300">Accuracy Rate</CardTitle>
              <Star className="h-4 w-4 text-navy-600 dark:text-cream-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy-900 dark:text-cream-50">87%</div>
              <p className="text-xs text-navy-600 dark:text-cream-300">+5% this week</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy-600 dark:text-cream-300">Study Streak</CardTitle>
              <Zap className="h-4 w-4 text-navy-600 dark:text-cream-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy-900 dark:text-cream-50">5 days</div>
              <p className="text-xs text-navy-600 dark:text-cream-300">Keep it up! 🔥</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Flashcard Decks */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                <BookOpen className="h-5 w-5" />
                Your Decks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
                  ))}
                </div>
              ) : decks.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-navy-300 dark:text-cream-600" />
                  <p className="text-navy-600 dark:text-cream-400">No flashcard decks yet</p>
                  <p className="text-sm text-navy-500 dark:text-cream-500 mt-2">
                    Create your first deck to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {decks.map((deck, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                    >
                      <Card className="h-full border-cream-200 dark:border-navy-600 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-navy-900 dark:text-cream-50 text-sm">{deck.title}</h3>
                            <Badge
                              variant={
                                deck.cards.every((card) => card.difficulty === "easy")
                                  ? "secondary"
                                  : deck.cards.every((card) => card.difficulty === "medium")
                                    ? "default"
                                    : "destructive"
                              }
                              className="text-xs"
                            >
                              {deck.cards.every((card) => card.difficulty === "easy")
                                ? "easy"
                                : deck.cards.every((card) => card.difficulty === "medium")
                                  ? "medium"
                                  : "hard"}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-navy-600 dark:text-cream-300">
                              <span>{deck.cards.length} cards</span>
                              <span>{80}% complete</span>
                            </div>
                            <Progress value={80} className="h-1" />
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-navy-500 dark:text-cream-400">{"2 hours ago"}</span>
                            <Button
                              size="sm"
                              onClick={() => {
                                setStudyMode(true)
                                setFlashcards(deck.cards)
                              }}
                              className="h-7 px-3 text-xs"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Study
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
