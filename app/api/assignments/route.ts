export const dynamic = "force-dynamic";

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
