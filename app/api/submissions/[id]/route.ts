import checkRoleBasedAccess from "@/lib/checkRoleAccess";
import { prisma } from "@/lib/db";
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
            where: {id: problemId, assignmentId: null},
            select: {
                id: true,
                problemId: true,

                
            }
        })
        
    } catch (error) {
        
    }
}




// id: string;
// problemId: string;
// assignmentId: string | null;
// studentId: string;
// language: string;
// code: string;
// status: $Enums.SubmissionStatus;
// score: number | null;
// feedback: string | null;
// testCasesPassed: number | null;
// totalTestCases: number | null;
// executionTime: number | null;
// memoryUsed: number | null;
// plagiarismScore: number | null;
// plagiarizedFrom: string | null;
// judge0Token: string | null;
// judge0Result: JsonValue | null;
// submittedAt: Date;


