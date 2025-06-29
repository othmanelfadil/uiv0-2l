"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Search, Bell, Settings, User, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Globe3D } from "@/components/globe-3d"

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/chat": "AI Chat",
  "/exam-generator": "Exam Generator",
  "/flashcards": "Flashcards",
  "/achievements": "Achievements",
  "/settings": "Settings",
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "achievement" | "system" | "reminder"
}

const sampleNotifications: Notification[] = []

export function TopNavbar() {
  const pathname = usePathname()
  const currentPageName = pageNames[pathname] || "LearnSphere.ai"
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userProfile, setUserProfile] = useState<{ id: string; name: string; email: string; image?: string } | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [notificationOpen, setNotificationOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return "🏆"
      case "reminder":
        return "⏰"
      case "system":
        return "🔧"
      default:
        return "📢"
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        // TODO: Get actual user ID from auth context
        const userId = "current-user-id"

        // TODO: Implement apiClient
        const apiClient = {
          getNotifications: async (userId: string) => {
            return { success: true, data: [] }
          },
          getCurrentUser: async () => {
            return { success: true, data: { id: "1", name: "John Doe", email: "john.doe@example.com" } }
          },
        }

        const notificationsResponse = await apiClient.getNotifications(userId)
        if (notificationsResponse.success) {
          setNotifications(notificationsResponse.data || [])
        }

        const userResponse = await apiClient.getCurrentUser()
        if (userResponse.success) {
          setUserProfile(userResponse.data)
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-cream-200 dark:border-navy-700 bg-white/80 dark:bg-navy-800/80 backdrop-blur-md"
    >
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section - Page Title with 3D Globe */}
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-3">
              <Globe3D size={32} />
              <div className="flex flex-col">
                <span className="text-sm font-bold bg-gradient-to-r from-navy-900 to-navy-600 dark:from-cream-50 dark:to-cream-200 bg-clip-text text-transparent">
                  LearnSphere.ai
                </span>
                <div className="h-px bg-cream-300 dark:bg-navy-600 w-full" />
              </div>
            </div>
            <motion.h1
              className="text-xl font-semibold text-navy-900 dark:text-cream-50 ml-2"
              key={currentPageName}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {currentPageName}
            </motion.h1>
          </motion.div>
        </div>

        {/* Center Section - Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="hidden md:flex items-center max-w-md w-full"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy-400 dark:text-cream-400" />
            <Input
              placeholder="Search anything..."
              className="pl-10 bg-cream-50 dark:bg-navy-700 border-cream-200 dark:border-navy-600 focus:border-navy-400 dark:focus:border-cream-400 transition-colors"
            />
          </div>
        </motion.div>

        {/* Right Section - Actions & Profile */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          {/* Notifications */}
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-navy-600 dark:text-cream-300" />
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-600 flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
              <div className="border-b border-cream-200 dark:border-navy-700 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-navy-900 dark:text-cream-50">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-navy-600 dark:text-cream-300 hover:text-navy-900 dark:hover:text-cream-50"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-navy-300 dark:text-cream-600" />
                      <p className="text-navy-600 dark:text-cream-400">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative p-4 border-b border-cream-100 dark:border-navy-800 hover:bg-cream-50 dark:hover:bg-navy-700/50 transition-colors cursor-pointer ${
                          !notification.read ? "bg-navy-50/50 dark:bg-navy-700/30" : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4
                                className={`text-sm font-medium ${
                                  !notification.read
                                    ? "text-navy-900 dark:text-cream-50"
                                    : "text-navy-700 dark:text-cream-200"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/20"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                              >
                                <X className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                            <p
                              className={`text-xs mt-1 ${
                                !notification.read
                                  ? "text-navy-600 dark:text-cream-300"
                                  : "text-navy-500 dark:text-cream-400"
                              }`}
                            >
                              {notification.message}
                            </p>
                            <p className="text-xs text-navy-400 dark:text-cream-500 mt-2">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
              {notifications.length > 0 && (
                <div className="border-t border-cream-200 dark:border-navy-700 p-2">
                  <Button variant="ghost" className="w-full text-sm text-navy-600 dark:text-cream-300">
                    View all notifications
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Quick Settings */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-navy-600 dark:text-cream-300" />
            </Button>
          </motion.div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 ring-2 ring-cream-200 dark:ring-navy-600">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-navy-100 dark:bg-navy-700 text-navy-900 dark:text-cream-50">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userProfile?.name || "Loading..."}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userProfile?.email || ""}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </motion.header>
  )
}
