// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Only apply to /api routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    // Handle actual requests
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
  
  return NextResponse.next();
}


export default withAuth({
  pages: {
    signIn: "/sign-in", // Path to your login page
  },
});

export const config = {
  matcher: ['/homeFeed', '/createPost', '/profilePage', '/createList', '/api/:path*'],
};
