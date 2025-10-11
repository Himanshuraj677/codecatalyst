import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { categorySchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.problemCategory.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json({ success: true, data: categories, message: "Fetched successfully" });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch categories" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = categorySchema.parse(body);
    const newCategory = await prisma.problemCategory.create({
      data: {
        name,
      },
    });
    return NextResponse.json({ success: true, data: newCategory, message: "Category created successfully" });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ success: false, message: "Failed to create category" });
  }
}
