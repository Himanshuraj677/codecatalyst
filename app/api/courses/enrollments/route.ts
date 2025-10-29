import checkRoleBasedAccess from "@/lib/checkRoleAccess";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/error-handler";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const joinCode = searchParams.get("joinCode");
    if (!joinCode) {
        return NextResponse.json({
            success: false,
            message: "Course id doesn't found"
        })
    }
    const course = await prisma.course.findUnique({
        where: {joinCode}
    })

    if (!course) {
        return NextResponse.json({
            success: false,
            message: "Invalid join code"
        }, {status: 404});
    }
    const courseId = course.id;
    const permissions = {
      course: ["join"],
    };
    const checkAccess = await checkRoleBasedAccess({ req, permissions });
    if (!checkAccess.hasAccess || !checkAccess.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: checkAccess.message },
        { status: 401 }
      );
    }
    const studentId = checkAccess.user.id;
    const enrollment = await prisma.enrollment.create({
        data: {
            studentId,
            courseId
        }
    }) 
    return NextResponse.json({
        success: true,
        message: "Course joined successfully",
        data: enrollment
    })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "You have already joined this course.",
        },
        { status: 400 }
      );
    }
    return handleApiError(error);
  }
}
