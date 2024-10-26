import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { JwtPayload, verify } from "jsonwebtoken"; // Assuming you are using JWT for authentication

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Extract the token from cookies
  const token = req.cookies.get("auth_token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify the JWT token
    const decoded = verify(token.value, process.env.JWT_SECRET ?? "");
    const userId = (decoded as JwtPayload).id;

    // Fetch the user's cart with cart items and product details
    const cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: true, // Include product details
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(cart.items, { status: 200 }); // Return only items
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Error fetching cart" }, { status: 500 });
  }
}
