import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  action: z.enum(["login", "register"]),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, action } = authSchema.parse(body)

    if (action === "login") {
      // Mock login validation
      if (email === "john.doe@example.com" && password === "password123") {
        return NextResponse.json({
          success: true,
          user: {
            id: "1", // TODO: Get from database
            name: "John Doe",
            email: "john.doe@example.com",
            level: 5,
            xp: 1250,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          token: "mock-jwt-token", // TODO: Generate JWT token
        })
      } else {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
      }
    }

    if (action === "register") {
      // Mock registration
      return NextResponse.json({
        success: true,
        user: {
          id: "2", // TODO: Get from database
          name: email.split("@")[0],
          email,
          level: 1,
          xp: 0,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        token: "mock-jwt-token", // TODO: Generate JWT token
      })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Invalid input", errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
