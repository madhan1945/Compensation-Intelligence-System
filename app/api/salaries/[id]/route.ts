import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-utils";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entry = await prisma.salaryEntry.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            name: true,
            canonicalName: true,
            slug: true,
            logoUrl: true,
            industry: true,
            headquarters: true,
          },
        },
      },
    });

    if (!entry) {
      return apiError("Salary entry not found", 404);
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error("GET /api/salaries/[id] failed:", error);
    return apiError("Internal server error", 500);
  }
}
