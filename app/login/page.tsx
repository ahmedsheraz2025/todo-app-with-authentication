"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow"
      >
        <h1 className="mb-4 text-center text-2xl font-semibold">Login</h1>
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <label className="mb-1 block text-sm pb-1">Username</label>
        <input
          className="mb-3 w-full rounded-2xl border px-3 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label className="mb-1 block text-sm pb-1">Password</label>
        <input
          type="password"
          className="mb-4 w-full rounded-2xl border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full relative overflow-hidden rounded-2xl border border-black mt-6 px-6 py-2.5 font-medium text-black transition-colors duration-300 hover:text-white before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-black before:transition-transform before:duration-300 hover:before:scale-x-100 z-0"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-4 text-sm text-zinc-600">
          No account?{" "}
          <a href="/signup" className="text-blue-600 hover:text-blue-800">
            Sign up
          </a>
        </p>
        <p className="mt-8 text-sm text-center">
          <Link href="/" className="text-zinc-500 hover:text-zinc-800">
            Back to home
          </Link>
        </p>
      </form>
    </main>
  );
}
