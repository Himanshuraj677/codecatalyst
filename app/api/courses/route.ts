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
    const userId = checkAccess.user.id;
    const course = await prisma.course.create({
      data: {
        name,
        description,
        instructorId: userId,
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

export async function GET(req: NextRequest) {
  try {
    const checkAccess = await checkRoleBasedAccess({ req });

    if (!checkAccess.hasAccess || !checkAccess.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: checkAccess.message ?? "Access denied",
        },
        { status: 401 }
      );
    }

    const userId = checkAccess.user.id;
    const userRole = checkAccess.user.role;

    let rawCourses: any[] = [];

    if (userRole === "user") {
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: userId },
        select: {
          course: {
            select: {
              id: true,
              name: true,
              description: true,
              joinCode: true,
              createdAt: true,
              instructor: { select: { name: true } },
              _count: { select: { enrollments: true } },
            },
          },
        },
      });

      rawCourses = enrollments.map((e) => e.course);
    } else {
      rawCourses = await prisma.course.findMany({
        where: { instructorId: userId },
        select: {
          id: true,
          name: true,
          description: true,
          joinCode: true,
          createdAt: true,
          instructor: { select: { name: true } },
          _count: { select: { enrollments: true } },
        },
      });
    }

    const formattedCourses = rawCourses.map((course) => ({
      id: course.id,
      name: course.name,
      description: course.description,
      joinCode: course.joinCode,
      createdAt: course.createdAt,
      instructor: course.instructor?.name ?? "Unknown",
      studentCount: course._count?.enrollments ?? 0,
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedCourses,
        message: "Fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "Unable to fetch course",
      },
      { status: 500 }
    );
  }
}

