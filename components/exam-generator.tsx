"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Upload, Link, Settings, Play, Download, Clock, Target, BookOpen, Zap } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"

interface Exam {
  id: string
  title: string
  questions: any[] // Adjust type as needed
  createdAt: string
}

export function ExamGenerator() {
  const [examSettings, setExamSettings] = useState({
    questions: 10,
    difficulty: "medium",
    timeLimit: 30,
    questionTypes: ["multiple-choice", "true-false"],
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedExam, setGeneratedExam] = useState<any>(null)
  const [recentExams, setRecentExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentExams = async () => {
      try {
        setLoading(true)
        // TODO: Get actual user ID from auth context
        const userId = "current-user-id"

        const response = await apiClient.getUserExams(userId)
        if (response.success) {
          // Get the 3 most recent exams
          const recent = (response.data || []).slice(0, 3)
          setRecentExams(recent)
        }
      } catch (error) {
        console.error("Failed to fetch recent exams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentExams()
  }, [])

  const handleGenerateExam = async () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setGeneratedExam({
        title: "Generated Exam",
        questions: examSettings.questions,
        timeLimit: examSettings.timeLimit,
        difficulty: examSettings.difficulty,
      })
      setIsGenerating(false)
    }, 3000)
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

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-navy-900 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-6"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-cream-50 mb-2">Exam Generator</h1>
          <p className="text-navy-600 dark:text-cream-300">Create custom exams from your content using AI</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                    <BookOpen className="h-5 w-5" />
                    Content Input
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="text" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="text" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Text
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload
                      </TabsTrigger>
                      <TabsTrigger value="url" className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        URL
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="text" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="content-text">Enter your content</Label>
                        <Textarea
                          id="content-text"
                          placeholder="Paste your study material here..."
                          className="min-h-[200px]"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="upload" className="space-y-4">
                      <div className="border-2 border-dashed border-cream-300 dark:border-navy-600 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-navy-400 dark:text-cream-400" />
                        <h3 className="text-lg font-semibold text-navy-900 dark:text-cream-50 mb-2">
                          Upload Documents
                        </h3>
                        <p className="text-navy-600 dark:text-cream-300 mb-4">
                          Drag and drop your files here, or click to browse
                        </p>
                        <Button variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Files
                        </Button>
                        <p className="text-xs text-navy-500 dark:text-cream-400 mt-2">Supported: PDF, DOC, DOCX, TXT</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="url" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="content-url">Website URL</Label>
                        <Input id="content-url" placeholder="https://example.com/article" type="url" />
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Link className="h-4 w-4 mr-2" />
                        Fetch Content
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>

            {generatedExam && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} variants={itemVariants}>
                <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                      <Target className="h-5 w-5" />
                      Generated Exam
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-navy-900 dark:text-cream-50">
                          {generatedExam.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary">{generatedExam.questions} Questions</Badge>
                          <Badge variant="secondary">{generatedExam.timeLimit} Minutes</Badge>
                          <Badge variant="secondary">{generatedExam.difficulty}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button>
                          <Play className="h-4 w-4 mr-2" />
                          Start Exam
                        </Button>
                      </div>
                    </div>
                    <div className="bg-cream-50 dark:bg-navy-700 rounded-lg p-4">
                      <p className="text-sm text-navy-600 dark:text-cream-300">
                        Your exam has been generated successfully! You can now start taking the exam or export it for
                        later use.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                    <Settings className="h-5 w-5" />
                    Exam Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Number of Questions</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[examSettings.questions]}
                        onValueChange={(value) => setExamSettings({ ...examSettings, questions: value[0] })}
                        max={50}
                        min={5}
                        step={5}
                      />
                      <div className="flex justify-between text-sm text-navy-600 dark:text-cream-300">
                        <span>5</span>
                        <span>{examSettings.questions}</span>
                        <span>50</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty Level</Label>
                    <Select
                      value={examSettings.difficulty}
                      onValueChange={(value) => setExamSettings({ ...examSettings, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Limit (minutes)</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[examSettings.timeLimit]}
                        onValueChange={(value) => setExamSettings({ ...examSettings, timeLimit: value[0] })}
                        max={120}
                        min={10}
                        step={5}
                      />
                      <div className="flex justify-between text-sm text-navy-600 dark:text-cream-300">
                        <span>10 min</span>
                        <span>{examSettings.timeLimit} min</span>
                        <span>120 min</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Question Types</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-navy-900 dark:text-cream-50">Multiple Choice</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-navy-900 dark:text-cream-50">True/False</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-navy-900 dark:text-cream-50">Short Answer</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-navy-900 dark:text-cream-50">Essay</span>
                      </label>
                    </div>
                  </div>

                  <Button onClick={handleGenerateExam} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Exam
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                    <Clock className="h-5 w-5" />
                    Recent Exams
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 rounded-lg" />
                      ))}
                    </div>
                  ) : recentExams.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-navy-300 dark:text-cream-600" />
                      <p className="text-sm text-navy-600 dark:text-cream-400">No exams yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentExams.map((exam, index) => (
                        <div
                          key={exam.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-cream-50 dark:bg-navy-700"
                        >
                          <div>
                            <h4 className="text-sm font-medium text-navy-900 dark:text-cream-50">{exam.title}</h4>
                            <p className="text-xs text-navy-600 dark:text-cream-300">
                              {exam.questions.length} questions • {new Date(exam.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
