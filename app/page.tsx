import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";

export const instant = false;

export default async function Home() {
  const userId = await getSessionUserId();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
          Todo App
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          Manage your todos with your own account
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-full bg-black px-6 py-2 text-white hover:bg-zinc-800"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-zinc-300 px-6 py-2 text-zinc-900 hover:bg-zinc-100"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
