import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Redirect root path to landing page
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/landing', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    // Protect API routes that require authentication
    "/api/urls",
    // Add other protected routes here
  ]
}
