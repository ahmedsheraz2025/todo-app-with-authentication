import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo || todo.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let completed = !todo.completed;
  try {
    const body = await request.json();
    if (typeof body?.completed === "boolean") completed = body.completed;
  } catch {
    // no body; toggle
  }

  const updated = await prisma.todo.update({
    where: { id },
    data: { completed },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Params) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo || todo.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
