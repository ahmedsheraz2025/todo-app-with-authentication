import { getSessionUserId } from "@/lib/session";

export async function getAuthUserId(): Promise<string | null> {
  return getSessionUserId();
}
