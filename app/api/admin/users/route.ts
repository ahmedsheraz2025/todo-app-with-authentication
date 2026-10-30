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

  const activeSessions = await prisma.session.findMany({
    where: { revokedAt: null, expiresAt: { gt: new Date() } },
    select: { userId: true },
  });
  const onlineUserIds = new Set(activeSessions.map((s) => s.userId));

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { todos: true } } },
  });

  const result = users.map((u) => ({
    id: u.id,
    username: u.username,
    createdAt: u.createdAt,
    todoCount: u._count.todos,
    online: onlineUserIds.has(u.id),
  }));

  return NextResponse.json(result);
}