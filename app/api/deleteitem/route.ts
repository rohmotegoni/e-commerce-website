import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, res: NextResponse) {
  const prisma = new PrismaClient();
  const body = await req.json();
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: parseInt(body.id) },
  });

  if (!cartItem) {
    return NextResponse.json(
      { message: "Item not found in cart" },
      { status: 404 }
    );
  }

  // Delete the CartItem
  await prisma.cartItem.delete({
    where: { id: parseInt(body.id) },
  });

  return NextResponse.json(
    { message: "Item deleted from cart" },
    { status: 200 }
  );
}
