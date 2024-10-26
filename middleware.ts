import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/", "/admin", "/user"], // Apply the middleware to root, admin, and user routes
};

const jwtsecret = process.env.JWT_SECRET || "your_jwt_secret"; // Use your secret key

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token");

  // If no token is found, redirect to sign-in page
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  const secretKey = new TextEncoder().encode(jwtsecret);

  try {
    // Verify the token using jose
    const { payload } = await jwtVerify(token.value, secretKey);

    // Extract the role from the token payload
    const userRole = payload.role;

    const currentPath = req.nextUrl.pathname;

    // If the user hits the root '/', redirect them based on their role
    if (currentPath === "/") {
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else if (userRole === "USER") {
        return NextResponse.redirect(new URL("/user", req.url));
      }
    }

    // Restrict access to admin routes
    if (currentPath.startsWith("/admin")) {
      if (userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/user", req.url)); // Redirect non-admins to user page
      }
    }

    // Allow access to user routes
    if (currentPath.startsWith("/user") && userRole !== "USER") {
      return NextResponse.redirect(new URL("/admin", req.url)); // Redirect non-users to admin page
    }

    // Allow users to access their specific pages
    return NextResponse.next();
  } catch (error) {
    console.error("Error verifying token:", error);
    // In case of an invalid or expired token, redirect to sign-in
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}
