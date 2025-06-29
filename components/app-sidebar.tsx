"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  MessageSquare,
  Settings,
  Trophy,
  BookOpen,
  FileText,
  UserIcon,
  Moon,
  Sun,
  ChevronRight,
  Brain,
  LogOut,
} from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Exam Generator",
    url: "/exam-generator",
    icon: FileText,
  },
  {
    title: "Flashcards",
    url: "/flashcards",
    icon: BookOpen,
  },
  {
    title: "Achievements",
    url: "/achievements",
    icon: Trophy,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const { state } = useSidebar()
  const { user, logout } = useAuth()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const isCollapsed = state === "collapsed"

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(url)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <Sidebar className="border-r border-cream-200 dark:border-navy-800 bg-cream-50 dark:bg-navy-900">
      <SidebarHeader className="p-4 border-b border-cream-200 dark:border-navy-700">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-navy-600 to-navy-700 dark:from-cream-200 dark:to-cream-300">
            <Brain className="h-6 w-6 text-cream-50 dark:text-navy-900" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-navy-900 to-navy-600 dark:from-cream-50 dark:to-cream-300 bg-clip-text text-transparent">
                    LearnSphere.ai
                  </h1>
                  <p className="text-xs text-navy-600 dark:text-cream-400 font-medium">AI-Powered Learning</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item, index) => {
            const active = isActive(item.url)

            return (
              <SidebarMenuItem key={item.title}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                  onHoverStart={() => setHoveredItem(item.title)}
                  onHoverEnd={() => setHoveredItem(null)}
                  className="relative"
                >
                  {/* Active indicator bar */}
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        layoutId="activeBar"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          opacity: { duration: 0.2 },
                        }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-navy-600 to-navy-700 dark:from-cream-200 dark:to-cream-300 rounded-r-full z-10"
                      />
                    )}
                  </AnimatePresence>

                  <SidebarMenuButton
                    asChild
                    className={`
                      relative w-full transition-all duration-200 ease-out
                      ${
                        active
                          ? "bg-gradient-to-r from-navy-100 to-navy-50 dark:from-navy-700 dark:to-navy-800 text-navy-900 dark:text-cream-50 shadow-sm border border-navy-200/50 dark:border-navy-600/50"
                          : "hover:bg-navy-50 dark:hover:bg-navy-800/50 text-navy-700 dark:text-cream-200"
                      }
                      ${isCollapsed ? "justify-center" : "justify-start"}
                    `}
                  >
                    <button
                      onClick={() => router.push(item.url)}
                      className="w-full h-full flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    >
                      {/* Hover background effect */}
                      <motion.div
                        className="absolute inset-0 bg-navy-100/30 dark:bg-navy-700/30 rounded-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                          opacity: hoveredItem === item.title && !active ? 1 : 0,
                          scale: hoveredItem === item.title && !active ? 1 : 0.95,
                        }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                      />

                      {/* Icon with enhanced active state */}
                      <motion.div
                        className="relative z-10"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <item.icon
                          className={`
                            h-5 w-5 transition-all duration-200
                            ${
                              active
                                ? "text-navy-700 dark:text-cream-100 drop-shadow-sm"
                                : "text-navy-600 dark:text-cream-300"
                            }
                          `}
                        />
                      </motion.div>

                      {/* Text label with smooth transitions */}
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className={`
                              relative z-10 overflow-hidden whitespace-nowrap font-medium transition-all duration-200
                              ${
                                active
                                  ? "text-navy-900 dark:text-cream-50 font-semibold"
                                  : "text-navy-700 dark:text-cream-200"
                              }
                            `}
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Active chevron indicator */}
                      <AnimatePresence>
                        {active && !isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: -10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: -10 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                              opacity: { duration: 0.2 },
                            }}
                            className="ml-auto relative z-10"
                          >
                            <div className="flex items-center gap-1">
                              <motion.div
                                className="w-1.5 h-1.5 bg-navy-600 dark:bg-cream-300 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "easeInOut",
                                }}
                              />
                              <ChevronRight className="h-4 w-4 text-navy-600 dark:text-cream-300" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Collapsed state active indicator */}
                      <AnimatePresence>
                        {active && isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="absolute -right-1 -top-1 w-3 h-3 bg-navy-600 dark:bg-cream-300 rounded-full border-2 border-cream-50 dark:border-navy-900"
                          />
                        )}
                      </AnimatePresence>
                    </button>
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex items-center gap-3 overflow-hidden"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-navy-200 dark:ring-navy-700">
                    <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} />
                    <AvatarFallback className="bg-navy-100 dark:bg-navy-800">
                      {user?.name ? (
                        user.name.charAt(0).toUpperCase()
                      ) : (
                        <UserIcon className="h-4 w-4 text-navy-600 dark:text-cream-300" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-navy-900 dark:text-cream-50">
                      {user?.name || "Loading..."}
                    </span>
                    <span className="text-xs text-navy-600 dark:text-cream-300">
                      {user ? `Level ${user.level} • ${user.xp.toLocaleString()} XP` : ""}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-1">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-8 w-8 shrink-0 hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: theme === "dark" ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Moon className="h-4 w-4 text-navy-600" />
                    )}
                  </motion.div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-8 w-8 shrink-0 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
