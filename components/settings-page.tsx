"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Upload, FileText, BookOpen, Palette, Camera, Save, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg?height=100&width=100")
  const [examSettings, setExamSettings] = useState({
    defaultQuestions: 10,
    difficulty: "medium",
    timeLimit: 30,
    autoGenerate: true,
  })
  const [flashcardSettings, setFlashcardSettings] = useState({
    cardsPerSession: 20,
    reviewInterval: "spaced",
    showHints: true,
    autoFlip: false,
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
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
        className="max-w-4xl mx-auto space-y-6"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-cream-50 mb-2">Settings</h1>
          <p className="text-navy-600 dark:text-cream-300">Customize your learning experience and preferences</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-navy-800">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="exams" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Exams
              </TabsTrigger>
              <TabsTrigger value="flashcards" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Flashcards
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                    <User className="h-5 w-5" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileImage || "/placeholder.svg"} />
                        <AvatarFallback>
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                        onClick={() => document.getElementById("profile-image")?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-navy-900 dark:text-cream-50">Profile Picture</h3>
                      <p className="text-sm text-navy-600 dark:text-cream-300">
                        Upload a new profile picture. Recommended size: 400x400px
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" defaultValue="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      defaultValue="john.doe@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      className="min-h-[100px]"
                      defaultValue="Passionate learner exploring AI and technology."
                    />
                  </div>

                  <Button className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                    <FileText className="h-5 w-5" />
                    Document Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-cream-300 dark:border-navy-600 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-navy-400 dark:text-cream-400" />
                    <h3 className="text-lg font-semibold text-navy-900 dark:text-cream-50 mb-2">Upload Documents</h3>
                    <p className="text-navy-600 dark:text-cream-300 mb-4">
                      Drag and drop your files here, or click to browse
                    </p>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                    <p className="text-xs text-navy-500 dark:text-cream-400 mt-2">
                      Supported formats: PDF, DOC, DOCX, TXT (Max 10MB per file)
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-navy-900 dark:text-cream-50">Processing Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-extract key concepts</Label>
                          <p className="text-sm text-navy-600 dark:text-cream-300">
                            Automatically identify and extract important concepts from uploaded documents
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Generate summaries</Label>
                          <p className="text-sm text-navy-600 dark:text-cream-300">
                            Create automatic summaries for long documents
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>OCR for images</Label>
                          <p className="text-sm text-navy-600 dark:text-cream-300">
                            Extract text from images and scanned documents
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exams" className="space-y-6">
              <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                    <BookOpen className="h-5 w-5" />
                    Exam Generation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Default Number of Questions</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[examSettings.defaultQuestions]}
                          onValueChange={(value) => setExamSettings({ ...examSettings, defaultQuestions: value[0] })}
                          max={50}
                          min={5}
                          step={5}
                        />
                        <div className="flex justify-between text-sm text-navy-600 dark:text-cream-300">
                          <span>5</span>
                          <span>{examSettings.defaultQuestions}</span>
                          <span>50</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Default Difficulty</Label>
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

                    <div className="space-y-4">
                      <Label>Question Types</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Multiple Choice</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">True/False</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Short Answer</Label>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Essay Questions</Label>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-navy-900 dark:text-cream-50">Input Sources</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4 border-cream-200 dark:border-navy-600">
                        <div className="text-center space-y-2">
                          <FileText className="h-8 w-8 mx-auto text-navy-600 dark:text-cream-300" />
                          <h5 className="font-medium text-navy-900 dark:text-cream-50">Text Input</h5>
                          <p className="text-xs text-navy-600 dark:text-cream-300">
                            Generate exams from direct text input
                          </p>
                          <Switch defaultChecked />
                        </div>
                      </Card>
                      <Card className="p-4 border-cream-200 dark:border-navy-600">
                        <div className="text-center space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-navy-600 dark:text-cream-300" />
                          <h5 className="font-medium text-navy-900 dark:text-cream-50">Document Upload</h5>
                          <p className="text-xs text-navy-600 dark:text-cream-300">
                            Create exams from uploaded documents
                          </p>
                          <Switch defaultChecked />
                        </div>
                      </Card>
                      <Card className="p-4 border-cream-200 dark:border-navy-600">
                        <div className="text-center space-y-2">
                          <FileText className="h-8 w-8 mx-auto text-navy-600 dark:text-cream-300" />
                          <h5 className="font-medium text-navy-900 dark:text-cream-50">URL Input</h5>
                          <p className="text-xs text-navy-600 dark:text-cream-300">Generate exams from web content</p>
                          <Switch />
                        </div>
                      </Card>
                    </div>
                  </div>

                  <Button className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Exam Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flashcards" className="space-y-6">
              <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                    <BookOpen className="h-5 w-5" />
                    Flashcard Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Cards per Study Session</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[flashcardSettings.cardsPerSession]}
                          onValueChange={(value) =>
                            setFlashcardSettings({ ...flashcardSettings, cardsPerSession: value[0] })
                          }
                          max={50}
                          min={5}
                          step={5}
                        />
                        <div className="flex justify-between text-sm text-navy-600 dark:text-cream-300">
                          <span>5</span>
                          <span>{flashcardSettings.cardsPerSession}</span>
                          <span>50</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Review Interval</Label>
                      <Select
                        value={flashcardSettings.reviewInterval}
                        onValueChange={(value) => setFlashcardSettings({ ...flashcardSettings, reviewInterval: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="spaced">Spaced Repetition</SelectItem>
                          <SelectItem value="daily">Daily Review</SelectItem>
                          <SelectItem value="weekly">Weekly Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-navy-900 dark:text-cream-50">Study Preferences</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Show hints</Label>
                          <p className="text-sm text-navy-600 dark:text-cream-300">
                            Display helpful hints when studying flashcards
                          </p>
                        </div>
                        <Switch
                          checked={flashcardSettings.showHints}
                          onCheckedChange={(checked) =>
                            setFlashcardSettings({ ...flashcardSettings, showHints: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-flip cards</Label>
                          <p className="text-sm text-navy-600 dark:text-cream-300">
                            Automatically flip cards after a set time
                          </p>
                        </div>
                        <Switch
                          checked={flashcardSettings.autoFlip}
                          onCheckedChange={(checked) =>
                            setFlashcardSettings({ ...flashcardSettings, autoFlip: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Shuffle cards</Label>
                          <p className="text-sm text-navy-600 dark:text-cream-300">
                            Randomize card order during study sessions
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Audio pronunciation</Label>
                          <p className="text-sm text-navy-600 dark:text-cream-300">
                            Play audio for text-to-speech on cards
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-navy-900 dark:text-cream-50">Generation Sources</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4 border-cream-200 dark:border-navy-600">
                        <div className="text-center space-y-2">
                          <FileText className="h-8 w-8 mx-auto text-navy-600 dark:text-cream-300" />
                          <h5 className="font-medium text-navy-900 dark:text-cream-50">Text Input</h5>
                          <p className="text-xs text-navy-600 dark:text-cream-300">
                            Create flashcards from direct text input
                          </p>
                          <Switch defaultChecked />
                        </div>
                      </Card>
                      <Card className="p-4 border-cream-200 dark:border-navy-600">
                        <div className="text-center space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-navy-600 dark:text-cream-300" />
                          <h5 className="font-medium text-navy-900 dark:text-cream-50">Document Upload</h5>
                          <p className="text-xs text-navy-600 dark:text-cream-300">
                            Generate flashcards from uploaded documents
                          </p>
                          <Switch defaultChecked />
                        </div>
                      </Card>
                      <Card className="p-4 border-cream-200 dark:border-navy-600">
                        <div className="text-center space-y-2">
                          <FileText className="h-8 w-8 mx-auto text-navy-600 dark:text-cream-300" />
                          <h5 className="font-medium text-navy-900 dark:text-cream-50">URL Input</h5>
                          <p className="text-xs text-navy-600 dark:text-cream-300">
                            Create flashcards from web content
                          </p>
                          <Switch />
                        </div>
                      </Card>
                    </div>
                  </div>

                  <Button className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Flashcard Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-cream-50">
                    <Palette className="h-5 w-5" />
                    Appearance Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-navy-900 dark:text-cream-50">Theme Selection</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className={`cursor-pointer transition-all ${
                            theme === "light" ? "ring-2 ring-navy-600 dark:ring-cream-300" : "hover:shadow-md"
                          }`}
                          onClick={() => setTheme("light")}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Sun className="h-5 w-5 text-yellow-500" />
                                <span className="font-medium text-navy-900 dark:text-cream-50">Light Theme</span>
                              </div>
                              <div className="h-16 rounded-md bg-gradient-to-br from-cream-50 to-cream-100 border border-cream-200 flex items-center justify-center">
                                <div className="w-8 h-8 rounded bg-navy-600"></div>
                              </div>
                              <p className="text-xs text-navy-600 dark:text-cream-300">
                                Clean cream and navy blue theme
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className={`cursor-pointer transition-all ${
                            theme === "dark" ? "ring-2 ring-navy-600 dark:ring-cream-300" : "hover:shadow-md"
                          }`}
                          onClick={() => setTheme("dark")}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Moon className="h-5 w-5 text-blue-400" />
                                <span className="font-medium text-navy-900 dark:text-cream-50">Dark Theme</span>
                              </div>
                              <div className="h-16 rounded-md bg-gradient-to-br from-navy-900 to-navy-800 border border-navy-700 flex items-center justify-center">
                                <div className="w-8 h-8 rounded bg-cream-200"></div>
                              </div>
                              <p className="text-xs text-navy-600 dark:text-cream-300">Dark navy with cream accents</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className={`cursor-pointer transition-all ${
                            theme === "system" ? "ring-2 ring-navy-600 dark:ring-cream-300" : "hover:shadow-md"
                          }`}
                          onClick={() => setTheme("system")}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Monitor className="h-5 w-5 text-gray-500" />
                                <span className="font-medium text-navy-900 dark:text-cream-50">System</span>
                              </div>
                              <div className="h-16 rounded-md bg-gradient-to-r from-cream-100 via-gray-200 to-navy-800 border border-gray-300 flex items-center justify-center">
                                <div className="w-8 h-8 rounded bg-gradient-to-r from-navy-600 to-cream-200"></div>
                              </div>
                              <p className="text-xs text-navy-600 dark:text-cream-300">Follow system preference</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-navy-900 dark:text-cream-50">Animation Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Enable animations</Label>
                          <p className="text-sm text-navy-600 dark:text-cream-300">
                            Turn on/off interface animations and transitions
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Reduced motion</Label>
                          <p className="text-sm text-navy-600 dark:text-cream-300">
                            Minimize animations for accessibility
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Smooth scrolling</Label>
                          <p className="text-sm text-navy-600 dark:text-cream-300">
                            Enable smooth scrolling throughout the app
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-navy-900 dark:text-cream-50">Display Settings</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Font Size</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                            <SelectItem value="extra-large">Extra Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>High contrast mode</Label>
                          <p className="text-sm text-navy-600 dark:text-cream-300">
                            Increase contrast for better visibility
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Compact layout</Label>
                          <p className="text-sm text-navy-600 dark:text-cream-300">
                            Reduce spacing for more content on screen
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Appearance Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}
