import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function getAuthUserId(): Promise<string | null> {
  return getSessionUserId();
}

export async function isAdminUserId(userId: string | null): Promise<boolean> {
  if (!userId) return false;
  const adminUsername = process.env.ADMIN_USERNAME;
  if (!adminUsername) return false;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return !!user && user.username === adminUsername;
}

export async function getAdminUserId(): Promise<string | null> {
  const userId = await getAuthUserId();
  if (!userId) return null;
  if (!(await isAdminUserId(userId))) return null;
  return userId;
}
