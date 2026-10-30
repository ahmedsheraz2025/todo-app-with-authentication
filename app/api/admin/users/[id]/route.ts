import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId, isAdminUserId } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await isAdminUserId(userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, createdAt: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const todos = await prisma.todo.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ user, todos });
}