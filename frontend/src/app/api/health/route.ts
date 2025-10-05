import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Basic health check
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    return NextResponse.json(health);
  } catch {
    return NextResponse.json(
      { status: "error", message: "Health check failed" },
      { status: 500 }
    );
  }
}
