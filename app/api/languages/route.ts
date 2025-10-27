import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.JUDGE0_URL}/languages`, {
      cache: "no-store", // prevent browser cache interference
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    // even if Judge0 returns 304, this ensures we handle it properly
    if (res.status === 304) {
      return NextResponse.json({
        success: true,
        message: "Languages not modified",
        data: [],
      });
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching Judge0 languages:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch languages" },
      { status: 500 }
    );
  }
}
