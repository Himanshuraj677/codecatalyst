import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/error-handler";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        problem: {
          select: {
            problem: {
              select: {
                id: true,
                title: true,
                description: true,
                difficulty: true,
                tags: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          error: "Not Found",
          message: "Assignment not found",
        },
        { status: 404 }
      );
    }

    const { problem, ...rest } = assignment;
    const formattedAssignment = {
      ...rest,
      problems: problem.map((p) => p.problem),
    };
    // Return the assignment details as a JSON response
    return NextResponse.json(
      {
        success: true,
        data: formattedAssignment,
        message: "Fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
