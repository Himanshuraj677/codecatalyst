import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { courseSchema } from "@/lib/validation";
import checkRoleBasedAccess from "@/lib/checkRoleAccess";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, joinCode } = courseSchema.parse(body);
    const permissions = {
      course: ["create"],
    };
    const checkAccess = await checkRoleBasedAccess({ permissions, req });
    if (!checkAccess.hasAccess || !checkAccess.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: checkAccess.message },
        { status: 401 }
      );
    }
    const instructorId = checkAccess.user.id;
    const course = await prisma.course.create({
      data: {
        name,
        description,
        instructorId,
        joinCode,
      },
    });

    return NextResponse.json(
      { success: true, course, message: "Created successfully" },
      { status: 201 }
    );
  } catch (error) {
    let errorMessage = "";
    if (error instanceof ZodError) {
      errorMessage = error.issues
        .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
        .join(", ");
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create course",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
