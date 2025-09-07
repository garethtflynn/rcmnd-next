import { withAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(request) {
    // Handle CORS for API routes
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
      
      // Handle actual API requests
      const response = NextResponse.next();
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return response;
    }
    
    // For non-API routes, NextAuth will handle authentication
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/sign-in", 
    },
  }
);

export const config = {
  matcher: ['/homeFeed', '/createPost', '/profilePage', '/createList', '/api/:path*'],
};