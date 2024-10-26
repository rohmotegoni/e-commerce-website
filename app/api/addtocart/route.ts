import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();
  const cookie = req.cookies.get("auth_token"); // Extract the cookie
  let userId: string | null = null;

  // Check if the cookie exists
  if (cookie) {
    try {
      const jwtSecret = process.env.JWT_SECRET || "mysupersecretpassword";
      const decoded: any = jwt.verify(cookie.value, jwtSecret); // Verify and decode the JWT
      userId = decoded.id; // Extract user ID from the decoded token
    } catch (error) {
      console.error("JWT verification error:", error);
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 }); // Unauthorized response if verification fails
    }
  } else {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 }); // Unauthorized if no cookie is found
  }

  const body = await req.json();

  // Check if the user has a cart
  const cart = await prisma.cart.findUnique({
    where: {
      userId: Number(userId),
    },
  });

  // If the cart does not exist, create it
  if (!cart) {
    const newCart = await prisma.cart.create({
      data: {
        userId: Number(userId), // Use the extracted user ID
      },
    });

    // Create a cart item in the new cart
    await prisma.cartItem.create({
      data: {
        cartId: newCart.id,
        productId: body.productId,
        quantity: body.quantity,
      },
    });
  } else {
    // If the cart exists, just add the item to the existing cart
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: body.productId,
        quantity: body.quantity,
      },
    });
  }

  return NextResponse.json({
    msg: "success",
  });
}
