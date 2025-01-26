// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; 
import jwt from 'jsonwebtoken';


export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow access to the login route
  if (pathname === '/authentication') {
    return NextResponse.next();
  }

  // Check for the JWT token in cookies or headers
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1];
  //console.log('Token from cookies:', token);

  if (!token) {
    //console.log('There is no token')
    // Redirect to the login page if no token is found
    return NextResponse.redirect(new URL('/authentication', request.url));
  }

  try {
    // Verify the token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Encode the secret
    const { payload } = await jwtVerify(token, secret); // Verify the token
    //console.log('Decoded token:', payload);

    // If the token is valid, allow the request to continue
    return NextResponse.next();
  } catch (error) {
    //console.log('you are inside catch block', error.message)
    // Redirect to the login page if the token is invalid
    return NextResponse.redirect(new URL('/authentication', request.url));
  }
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/profile'], // Only run middleware on the /profile route
};