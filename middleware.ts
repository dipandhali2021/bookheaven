import { authMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/", "/api/webhook/register", "/sign-in", "/sign-up", "/books", "/authors"];
const protectedRoutes = ['/payments/(.*)', '/user/(.*)'];
const adminRoutes = ['/admin/(.*)'];

export default authMiddleware({
  publicRoutes,
  async afterAuth(auth:any, req:any) {
    // Check if the route is protected but user is not authenticated
    const pathname = req.nextUrl.pathname;
    const isProtected = protectedRoutes.some(pattern => 
      new RegExp(`^${pattern.replace(/\(\.\*\)/g, '(.*)')}$`).test(pathname)
    );
    const isAdminRoute = adminRoutes.some(pattern => 
      new RegExp(`^${pattern.replace(/\(\.\*\)/g, '(.*)')}$`).test(pathname)
    );

    // Handle unauthenticated users trying to access protected routes
    if (!auth.userId && isProtected) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Handle admin-only routes
    if (isAdminRoute) {
      if (!auth.userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }

      try {
        const user = await (await clerkClient()).users.getUser(auth.userId);
        const role = user.publicMetadata.role as string | undefined;

        if (role !== 'admin') {
          return NextResponse.redirect(new URL('/', req.url));
        }
      } catch (error) {
        console.error("Error fetching user data from Clerk:", error);
        return NextResponse.redirect(new URL("/error", req.url));
      }
    }

    // We're removing the redirection for /books and /authors paths
    // Only redirect for specific public routes that need protection
    if (auth.userId && publicRoutes.includes(pathname) && 
        !["/", "/books", "/authors"].includes(pathname)) {
      try {
        const user = await (await clerkClient()).users.getUser(auth.userId);
        const role = user.publicMetadata.role as string | undefined;

        return NextResponse.redirect(
          new URL(role === "admin" ? "/admin/dashboard" : "/user/dashboard", req.url)
        );
      } catch (error) {
        console.error("Error fetching user data from Clerk:", error);
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
