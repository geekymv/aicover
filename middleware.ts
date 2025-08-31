import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/gallery",
    "/privacy-policy",
    "/terms-of-service",
    "/pricing",
    "/covers/awesome",
    "/covers/brand",
    "/covers/featured",
    "/covers/random",
    "/api/get-covers",
    "/api/get-user-info",
    "/api/download",
  ],

  afterAuth(auth, req, evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      if (auth.isApiRoute) {
        return NextResponse.json(
          { code: -2, message: "no auth" },
          { status: 401 }
        );
      } else {
        const url = new URL(req.url);
        if (
          !url.pathname.startsWith("/cover/") &&
          !url.pathname.startsWith("/user/")
        ) {
          return NextResponse.redirect(new URL("/sign-in", req.url));
        }
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"],
};
