import checkRoleBasedAccess from "@/lib/checkRoleAccess";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/error-handler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const problemId = params.id;
        const checkAccess = await checkRoleBasedAccess({req});
        if (!checkAccess.hasAccess || !checkAccess.user?.id) {
            return NextResponse.json({success: false, message: checkAccess.message}, {status: 403});
        }

        const submissions = await prisma.submission.findMany({
            where: {problemId, assignmentId: null},
            select: {
                id: true,
                problemId: true,
                languageId: true,
                status: true,
                executionTime: true,
                memoryUsed: true,
                createdAt: true
            }
        })
        return NextResponse.json({success: true, message: "Submissions fetched", data: submissions});
    } catch (error) {
       return handleApiError(error); 
    }
}


