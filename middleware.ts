import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // Get token from cookies or localStorage (we'll check localStorage on client side)
  const token = request.cookies.get("auth_token")?.value

  // If trying to access protected route without token, redirect to login
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If trying to access login/register with valid token, redirect to dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
