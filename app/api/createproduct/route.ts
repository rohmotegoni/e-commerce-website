import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const prisma = new PrismaClient();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      stock: body.stock,
      imageUrl: body.imageUrl?.toString(),
    },
  });
  return NextResponse.json(product);
};
export const GET = async () => {
  const prisma = new PrismaClient();
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
};
