import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId, isAdminUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await isAdminUserId(userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalUsers, totalTodos, sessions] = await Promise.all([
    prisma.user.count(),
    prisma.todo.count(),
    prisma.session.findMany({
      where: { revokedAt: null, expiresAt: { gt: new Date() } },
      select: { userId: true },
    }),
  ]);

  const loggedInUsers = new Set(sessions.map((s) => s.userId)).size;

  return NextResponse.json({ totalUsers, totalTodos, loggedInUsers });
}