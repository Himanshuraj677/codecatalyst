import checkRoleBasedAccess from "@/lib/checkRoleAccess";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/error-handler";
import { success } from "better-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const checkAccess = await checkRoleBasedAccess({ req });
    if (!checkAccess.hasAccess || !checkAccess.user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
        error: "You don't have permission",
      });
    }
    const course = await prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        joinCode: true,
        createdAt: true,
        instructor: {
          select: {
            name: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            maxAttempt: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
          error: "Course not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const { _count, ...rest } = course;
    const formattedCourse = {
      ...rest,
      studentCount: _count.enrollments,
    };

    console.log(formattedCourse);
    return NextResponse.json(
      {
        success: true,
        message: "Fetched successfully",
        data: formattedCourse,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
