import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId, isAdminUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = await isAdminUserId(userId);
  return NextResponse.json({ id: user.id, username: user.username, isAdmin: admin });
}