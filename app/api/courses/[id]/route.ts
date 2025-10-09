import checkRoleBasedAccess from "@/lib/checkRoleAccess";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/error-handler";
import { courseSchema } from "@/lib/validation";
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();
    const { name, description, joinCode } = courseSchema.parse(body);
    const permissions = {
      course: ["update"],
    };
    const checkAccess = await checkRoleBasedAccess({ permissions, req });
    if (!checkAccess.user) {
      return NextResponse.json(
        { success: false, message: checkAccess.message },
        { status: 401 }
      );
    }
    if (!checkAccess.hasAccess) {
      const course = await prisma.course.findUnique({
        where: { id },
      });
      if (!course) {
        return NextResponse.json(
          { success: false, message: "Course is not found" },
          { status: 404 }
        );
      }
      if (course?.instructorId !== checkAccess.user?.id) {
        return NextResponse.json(
          { success: false, message: "You don't have permission" },
          { status: 403 }
        );
      }
    }
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        name,
        description,
        joinCode,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Course has been updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const permissions = {
      course: ["delete"],
    };
    const checkAccess = await checkRoleBasedAccess({ permissions, req });
    if (!checkAccess.user) {
      return NextResponse.json(
        { success: false, message: checkAccess.message },
        { status: 401 }
      );
    }

    const hasPermission = checkAccess.hasAccess;
    const deletedCourse = await prisma.course.deleteMany({
      where: hasPermission
        ? { id } // admin can delete any course
        : { id, instructorId: checkAccess.user.id }, // instructor only
    });

    if (deletedCourse.count === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found or you don't have permission",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully!",
      data: null,
    });
  } catch (error) {
    console.log("it is throwing error");
    return handleApiError(error);
  }
}
