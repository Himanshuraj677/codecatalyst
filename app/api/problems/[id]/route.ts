import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        const {id} = params;
        const problem = await prisma.problem.findFirst({
            where: {id},
            include: {testCases: true}
        })
        if (!problem) return NextResponse.json({success: false, message: "Problem is not found!", data: null}, {status: 404});
        return NextResponse.json({success: true, message: "Problem has been fetched", data: problem}, {status: 200});
    } catch (error) {
        return NextResponse.json({success: false, message: "Internal sever error"}, {status: 500})
    }
}

