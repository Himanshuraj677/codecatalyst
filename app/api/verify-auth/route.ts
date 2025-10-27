import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs"; // ensures it's not edge

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ session });
}
