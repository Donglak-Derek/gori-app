import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // An array of public routes that don't require authentication.
  publicRoutes: ["/", "/api/webhook/clerk", "/profile/null"],

  // An array of routes to be ignored by the authentication middleware.
  ignoredRoutes: ["/", "/api/webhook/clerk", "/profile/null"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

// Resource: https://clerk.com/docs/nextjs/middleware#auth-middleware
