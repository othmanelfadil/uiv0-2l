"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Paperclip, Bot, User, X, FileText, ImageIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  attachments?: File[]
  isStreaming?: boolean
}

interface AttachedFile {
  file: File
  preview?: string
}

// Mock API client (replace with your actual API client)
const apiClient = {
  sendChatMessage: async (message: string, files: File[], conversationId: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate success response
    const responses = [
      "I understand you'd like help with that. Let me analyze your request and provide a comprehensive response.",
      "Based on your input, I can help you generate study materials, create exams, or answer specific questions about the content you've shared.",
      "I've processed your request and here's what I found. This information should help you with your learning objectives.",
      "Great question! Let me break this down for you step by step to ensure you get the most comprehensive understanding.",
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    const assistantMessage = {
      id: Date.now().toString(),
      content: randomResponse,
      sender: "assistant",
      timestamp: new Date(),
    }

    return {
      success: true,
      data: {
        message: assistantMessage,
      },
    }
  },
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // TODO: Load conversation history from API if conversationId exists
    // or show empty state for new conversation
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newAttachedFiles: AttachedFile[] = []

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          newAttachedFiles.push({
            file,
            preview: e.target?.result as string,
          })
          if (newAttachedFiles.length === files.length) {
            setAttachedFiles((prev) => [...prev, ...newAttachedFiles])
          }
        }
        reader.readAsDataURL(file)
      } else {
        newAttachedFiles.push({ file })
        if (newAttachedFiles.length === files.length) {
          setAttachedFiles((prev) => [...prev, ...newAttachedFiles])
        }
      }
    })
  }

  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const simulateStreamingResponse = (messageId: string, fullResponse: string) => {
    let currentIndex = 0
    const streamInterval = setInterval(() => {
      if (currentIndex < fullResponse.length) {
        const chunk = fullResponse.slice(0, currentIndex + 1)
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, content: chunk, isStreaming: true } : msg)),
        )
        currentIndex++
      } else {
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isStreaming: false } : msg)))
        setStreamingMessageId(null)
        setIsLoading(false)
        clearInterval(streamInterval)
      }
    }, 20)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      attachments: attachedFiles.map((af) => af.file),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setAttachedFiles([])
    setIsLoading(true)

    try {
      // TODO: Get actual conversation ID
      const conversationId = "current-conversation-id"

      const response = await apiClient.sendChatMessage(
        inputValue,
        attachedFiles.map((af) => af.file),
        conversationId,
      )

      if (response.success) {
        setMessages((prev) => [...prev, response.data.message])
      } else {
        // Handle error
        console.error("Failed to send message:", response.message)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-cream-50 dark:bg-navy-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-cream-200 dark:border-navy-800 bg-white dark:bg-navy-800 p-4"
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-navy-600 text-cream-50">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold text-navy-900 dark:text-cream-50">AI Assistant</h1>
            <p className="text-sm text-navy-600 dark:text-cream-300">Ready to help with your learning journey</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "assistant" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-navy-600 text-cream-50">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <Card
                className={`max-w-[70%] ${
                  message.sender === "user"
                    ? "bg-navy-600 text-cream-50 border-navy-600"
                    : "bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700"
                }`}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {message.content && (
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                        {message.isStreaming && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                            className="inline-block w-2 h-4 bg-current ml-1"
                          />
                        )}
                      </p>
                    )}

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.attachments.map((file, fileIndex) => (
                          <Badge key={fileIndex} variant="secondary" className="text-xs">
                            {file.type.startsWith("image/") ? (
                              <ImageIcon className="h-3 w-3 mr-1" />
                            ) : (
                              <FileText className="h-3 w-3 mr-1" />
                            )}
                            {file.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                </CardContent>
              </Card>

              {message.sender === "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-cream-200 text-navy-900">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && !streamingMessageId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <Avatar className="h-8 w-8 mt-1">
              <AvatarFallback className="bg-navy-600 text-cream-50">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <Card className="bg-white dark:bg-navy-800 border-cream-200 dark:border-navy-700">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-navy-600 dark:text-cream-300" />
                  <span className="text-sm text-navy-600 dark:text-cream-300">Thinking...</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* File Attachments Preview */}
      <AnimatePresence>
        {attachedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-cream-200 dark:border-navy-800 bg-white dark:bg-navy-800 p-4"
          >
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((attachedFile, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div className="flex items-center gap-2 bg-cream-100 dark:bg-navy-700 rounded-lg p-2 pr-8">
                    {attachedFile.preview ? (
                      <img
                        src={attachedFile.preview || "/placeholder.svg"}
                        alt={attachedFile.file.name}
                        className="h-8 w-8 object-cover rounded"
                      />
                    ) : (
                      <FileText className="h-4 w-4 text-navy-600 dark:text-cream-300" />
                    )}
                    <span className="text-sm text-navy-900 dark:text-cream-50 truncate max-w-32">
                      {attachedFile.file.name}
                    </span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => removeAttachedFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t border-cream-200 dark:border-navy-800 bg-white dark:bg-navy-800 p-4"
      >
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send)"
              className="pr-12 min-h-[40px] resize-none"
              disabled={isLoading}
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={(!inputValue.trim() && attachedFiles.length === 0) || isLoading}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </motion.div>
    </div>
  )
}
