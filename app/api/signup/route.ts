import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export const POST = async (req: NextRequest) => {
  const prisma = new PrismaClient();
  const body = await req.json();

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: body.password, // Ensure you are hashing passwords in a real application
        role: body.role,
      },
    });

    const jwtsecret = process.env.JWT_SECRET || "mysupersecretpassword";
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtsecret,
      {
        expiresIn: "1h", // Token expiration time
      }
    );

    // Set the cookie with the JWT
    const cookie = serialize("auth_token", token, {
      httpOnly: true, // Helps mitigate XSS
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 3600, // 1 hour
      path: "/", // Cookie is accessible on the entire site
    });

    // Return success response with the user data and the cookie
    return new Response(
      JSON.stringify({ user }), // Include user data in response
      {
        status: 201,
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json", // Set content type for JSON response
        },
      }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ message: "Signup failed", error: error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect(); // Ensure the Prisma client disconnects
  }
};
