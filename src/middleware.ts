// src/middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   // Get Firebase Auth token from cookies
//   const session = request.cookies.get('session')

//   // Auth paths must redirect to home if user is logged in
//   if (request.nextUrl.pathname.startsWith('/auth/')) {
//     if (session) {
//       return NextResponse.redirect(new URL('/petitions', request.url))
//     }
//     return NextResponse.next()
//   }

//   // For all other protected routes
//   if (request.nextUrl.pathname.startsWith('/petitions/')) {
//     if (!session) {
//       // Store the original intended destination
//       const url = new URL('/auth/login', request.url)
//       url.searchParams.set('from', request.nextUrl.pathname)
//       return NextResponse.redirect(url)
//     }
//   }

//   return NextResponse.next()
// }

// export const config = {
//   // Only run middleware on the specified routes
//   matcher: [
//     '/auth/:path*',
//     '/petitions/:path*',


//   ]
// }

// src/middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   const session = request.cookies.get('session')
//   console.log('Debug: Middleware - Path:', request.nextUrl.pathname);
//   console.log('Debug: Middleware - Session:', !!session);

//   // Auth paths must redirect to home if user is logged in
//   if (request.nextUrl.pathname.startsWith('/auth/')) {
//     if (session) {
//       return NextResponse.redirect(new URL('/petitions', request.url))
//     }
//     return NextResponse.next()
//   }

//   // For protected routes
//   const protectedPaths = ['/create-petition', '/petitions']
//   if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
//     console.log('Debug: Protected route accessed');
//     if (!session) {
//       console.log('Debug: No session found, redirecting to login');
//       const url = new URL('/auth/login', request.url)
//       url.searchParams.set('from', request.nextUrl.pathname)
//       return NextResponse.redirect(url)
//     }
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     '/auth/:path*',
//     '/petitions/:path*',
//     '/create-petition'
//   ]
// }

// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const pathname = request.nextUrl.pathname;

  // Paths that don't require authentication
  const publicPaths = ['/auth/login', '/auth/register', '/'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!session) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};