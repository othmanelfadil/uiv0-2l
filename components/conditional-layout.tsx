"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { TopNavbar } from "@/components/top-navbar"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-navy-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 dark:border-cream-300"></div>
      </div>
    )
  }

  // Public pages that don't need sidebar
  const publicPages = ["/login", "/register"]
  const isPublicPage = publicPages.includes(pathname)

  // If user is not authenticated and not on a public page, the middleware will redirect
  // If user is authenticated and on login page, redirect to dashboard
  if (user && isPublicPage) {
    window.location.href = "/"
    return null
  }

  // If on public page, render without sidebar
  if (isPublicPage) {
    return <>{children}</>
  }

  // If authenticated, render with sidebar
  if (user) {
    return (
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <TopNavbar />
          <main className="flex-1 overflow-hidden">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Fallback - should not reach here due to middleware
  return <>{children}</>
}
