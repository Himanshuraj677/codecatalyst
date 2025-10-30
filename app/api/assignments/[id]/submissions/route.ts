import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/error-handler";
import checkRoleBasedAccess from "@/lib/checkRoleAccess";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const checkAccess = await checkRoleBasedAccess({ req });
    if (!checkAccess.hasAccess || !checkAccess.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: checkAccess.message },
        { status: 401 }
      );
    }

    const userId = checkAccess.user.id;
    const role = checkAccess.user.role;

    let whereClause: any = { assignmentId: id };

    if (role === "user") {
      whereClause.studentId = userId;
    }
    const submissions = await prisma.submission.findMany({
      where: whereClause,
      select: {
        id: true,
        studentId: true,
        problemId: true,
        status: true,
        score: true,
        feedback: true,
        submittedAt: true,
        updatedAt: true,
        problem: {
          select: {
            title: true,
          },
        },
      },
    });

    if (submissions.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: "No submissions found",
        },
        { status: 200 }
      );
    }

    const formattedSubmissions = submissions.map((submission) => {
      const { problem, ...rest } = submission;
      return {
        ...rest,
        problemTitle: submission.problem.title,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: formattedSubmissions,
        message: "Fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
