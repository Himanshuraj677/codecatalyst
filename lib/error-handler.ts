import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { NextResponse } from "next/server";

export function handleApiError(err: unknown, customMessage?: string, statusCode = 500) {
  // Default message shown to user
  let userMessage = customMessage || "Something went wrong. Please try again.";

  // Log the actual error for debugging (server-side)
  console.error("Internal Error:", err);

  // Handle Zod errors (validation)
  if (err instanceof ZodError) {
    userMessage = err.issues
        .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
        .join(", ");
    statusCode = 400;
  } 
  // Handle Prisma errors internally
  else if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    // Map known Prisma error codes to user-friendly messages
    switch ((err as Prisma.PrismaClientKnownRequestError).code) {
      case "P2002": // Unique constraint failed
        userMessage = "This record already exists.";
        statusCode = 400;
        break;
      case "P2025": // Record not found
        userMessage = "Record not found.";
        statusCode = 404;
        break;
      default:
        userMessage = "Database error occurred.";
        statusCode = 500;
    }
  } 
  // Handle general JS errors
  else if (err instanceof Error) {
    userMessage = err.message || userMessage;
  }

  return NextResponse.json(
    { success: false, message: userMessage },
    { status: statusCode }
  );
}
