import checkRoleBasedAccess from "@/lib/checkRoleAccess";
import { problemSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/error-handler";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {title, description, difficulty, tags, timeLimit, memoryLimit, constraints, categoryId} = problemSchema.parse(body);
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
    const instructorId = checkAccess.user.id;
    // Create problem in database
    const problem = await prisma.problem.create({
      data: {
        title, 
        description, 
        difficulty, 
        tags, 
        timeLimit, 
        memoryLimit, 
        constraints, 
        categoryId, 
        createdById: instructorId,
        teacherSolution: "skjdjbk  kjwjw jbjBKJBWE",
        teacherSolutionLanguage: "Python",
      },
    });

    return NextResponse.json(
      { success: true, data: problem, message: "Created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, "Failed to create problem");
  }
}
