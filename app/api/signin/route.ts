import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { email, password } = body;
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return new Response("User not found", { status: 401 });
  }
  if (user.password !== password) {
    return new Response("Incorrect password", { status: 401 });
  }
  const jwtsecret = process.env.JWT_SECRET || "mysupersecretpassword";
  const token = jwt.sign({ id: user.id, email: user.email }, jwtsecret, {
    expiresIn: "1h", // Token expiration time
  });
  // Set the cookie with the JWT
  const cookie = serialize("auth_token", token, {
    httpOnly: true, // Helps mitigate XSS
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: 3600, // 1 hour
    path: "/", // Cookie is accessible on the entire site
  });
  // Return success response with the cookie
  return new Response("User logged in", {
    status: 200,
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
