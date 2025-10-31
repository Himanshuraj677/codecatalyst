import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import checkRoleBasedAccess from "@/lib/checkRoleAccess";
import { assignmentSchema } from "@/lib/validation";
import { handleApiError } from "@/lib/error-handler";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.maxAttempts === "") body.maxAttempts = undefined;
    const {
      title,
      description,
      courseId,
      selectedProblems,
      dueDate,
      maxAttempts = 1000,
    } = assignmentSchema.parse(body);
    const permissions = {
      problem: ["create"],
    };
    const checkAccess = await checkRoleBasedAccess({ permissions, req });
    if (!checkAccess.hasAccess || !checkAccess.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: checkAccess.message },
        { status: 401 }
      );
    }
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        courseId,
        dueDate,
        maxAttempt: maxAttempts,
        problem: {
          create: selectedProblems.map((problemId: string) => ({
            problem: { connect: { id: problemId } },
          })),
        },
      },
    });
    return NextResponse.json(
      { success: true, data: assignment, message: "Created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, "Failed to create assignment");
  }
}

export async function GET(req: NextRequest) {
  try {
    const checkAccess = await checkRoleBasedAccess({ req });
    if (!checkAccess.hasAccess || !checkAccess.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = checkAccess.user;
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    let assignments;

    if (user.role === "user") {
      // Get enrolled courses
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: user.id },
        select: { courseId: true },
      });

      const enrolledCourseIds = enrollments.map((e) => e.courseId);

      if (courseId) {
        // Ensure student is enrolled in the course
        if (!enrolledCourseIds.includes(courseId)) {
          return NextResponse.json(
            { success: false, message: "Not enrolled in this course" },
            { status: 403 }
          );
        }

        assignments = await prisma.assignment.findMany({
          where: { courseId },
          orderBy: { createdAt: "desc" },
          include: {
            course: { select: { id: true, name: true } }, // ✅ Include course name
          },
        });
      } else {
        assignments = await prisma.assignment.findMany({
          where: { courseId: { in: enrolledCourseIds } },
          orderBy: { createdAt: "desc" },
          include: {
            course: { select: { id: true, name: true } }, // ✅ Include course name
          },
        });
      }
    } else if (user.role === "teacher") {
      assignments = await prisma.assignment.findMany({
        where: courseId ? { courseId } : {},
        orderBy: { createdAt: "desc" },
        include: {
          course: { select: { id: true, name: true } }, // ✅ Include course name
        },
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid user role" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Assignments fetched successfully",
      data: assignments.map((a) => ({
        ...a,
        courseName: a.course?.name ?? "Unknown",
      })), // ✅ Flatten course name into top-level field
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return handleApiError(error, "Failed to fetch assignments");
  }
}
