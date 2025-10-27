import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/error-handler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const problem = await prisma.problem.findFirst({
      where: { id },
      include: {
        testCases: {
          where: {
            isHidden: false,
          },
          select: {
            id: true,
            problemId: true,
            input: true,
            expectedOutput: true,
          },
        },
        category: true
      },
    });
    if (!problem)
      return NextResponse.json(
        { success: false, message: "Problem is not found!", data: null },
        { status: 404 }
      );
    const formattedProblem = {
      id: problem.id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      tags: problem.tags,
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit,
      constraints: problem.constraints,
      categoryId: problem.categoryId,
      categoryName: problem.category.name,
      createdById: problem.createdById,
      createdAt: problem.createdAt,
      testCases: problem.testCases.map((testCase) => ({
        id: testCase.id,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
      })),
    };
    return NextResponse.json(
      {
        success: true,
        message: "Problem has been fetched",
        data: formattedProblem,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
