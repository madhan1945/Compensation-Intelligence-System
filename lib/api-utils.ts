import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function handleZodError(err: ZodError) {
  return NextResponse.json(
    { error: "Validation failed", details: err.flatten().fieldErrors },
    { status: 400 }
  );
}
