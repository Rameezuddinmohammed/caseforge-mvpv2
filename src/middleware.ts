import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          req.cookies.set({ name, value, ...options });
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          req.cookies.set({ name, value: '', ...options });
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Only handle basic redirects, let client-side handle the rest
  const { pathname } = req.nextUrl;

  // If accessing login page and already authenticated, redirect to dashboard
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

// If accessing root, redirect based on auth status
if (pathname === '/') {
  if (session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  } else {
    // Change this line to point to our new landing page
    return NextResponse.redirect(new URL('/landing', req.url));
  }
}
  return res;
}

export const config = {
  matcher: ['/', '/login'],
}; 