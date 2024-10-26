import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function DELETE(req: NextRequest) {
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
  const cart = await prisma.cart.findUnique({
    where: { userId: Number(userId) },
    include: { items: true },
  });

  if (!cart) {
    return NextResponse.json({ error: "Cart not found for the user." });
  }

  // Delete all items in the cart
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
  return NextResponse.json({ msg: "Cart Deleted", cart });
}
