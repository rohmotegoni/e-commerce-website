import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
export const POST = async (req: NextRequest) => {
  let prisma = new PrismaClient();
  let body = await req.json();
  let user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: body.password,
      role: body.role,
    },
  });
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
  return new Response("User created", {
    status: 201,
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
