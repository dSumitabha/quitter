// middleware.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow access to the login route
  if (pathname === '/authentication') {
    return NextResponse.next();
  }

  // Check for the JWT token in cookies or headers
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    // Redirect to the login page if no token is found
    return NextResponse.redirect(new URL('/authentication', request.url));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is valid, allow the request to continue
    return NextResponse.next();
  } catch (error) {
    // Redirect to the login page if the token is invalid
    return NextResponse.redirect(new URL('/authentication', request.url));
  }
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/profile'], // Only run middleware on the /profile route
};