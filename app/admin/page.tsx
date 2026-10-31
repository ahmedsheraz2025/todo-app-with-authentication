"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalUsers: number;
  totalTodos: number;
  loggedInUsers: number;
};

type UserRow = {
  id: string;
  username: string;
  createdAt: string;
  todoCount: number;
  online: boolean;
};

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type UserDetail = {
  user: { id: string; username: string; createdAt: string };
  todos: Todo[];
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const bgStyle = {
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.72), rgba(255,255,255,0.72)), url('/images/background.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
  };

  async function loadPanel() {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
      ]);
      if (statsRes.status === 401 || usersRes.status === 401) {
        setShowLogin(true);
        return;
      }
      if (statsRes.status === 403 || usersRes.status === 403) {
        setAccessDenied(true);
        return;
      }
      if (!statsRes.ok || !usersRes.ok) {
        setError("Failed to load admin data");
        return;
      }
      const s = await statsRes.json();
      const u = await usersRes.json();
      setStats(s);
      setUsers(u);
      setShowLogin(false);
      setAccessDenied(false);
      setError("");
    } catch {
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPanel();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    (async () => {
      setDetailLoading(true);
      const res = await fetch(`/api/admin/users/${selectedId}`);
      if (res.status === 401) {
        setShowLogin(true);
        setDetailLoading(false);
        return;
      }
      if (res.status === 403) {
        setAccessDenied(true);
        setDetailLoading(false);
        return;
      }
      if (!res.ok) {
        if (active) setError("Failed to load user");
        if (active) setDetailLoading(false);
        return;
      }
      const data = await res.json();
      if (active) {
        setDetail(data);
        setDetailLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedId]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error ?? "Admin login failed");
        return;
      }
      await loadPanel();
    } catch {
      setLoginError("Network error");
    } finally {
      setLoginLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setStats(null);
    setUsers([]);
    setSelectedId(null);
    setDetail(null);
    setShowLogin(true);
    setAccessDenied(false);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p>Loading...</p>
      </main>
    );
  }

  if (showLogin) {
    return (
      <main style={bgStyle} className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-3xl bg-white p-6 shadow"
        >
          <h1 className="mb-4 text-2xl text-center font-semibold">Admin Login</h1>
          {loginError && (
            <p className="mb-3 text-sm text-red-600">{loginError}</p>
          )}
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
            disabled={loginLoading}
            className="w-full relative overflow-hidden rounded-2xl border border-black mt-6 px-6 py-2.5 font-medium text-black transition-colors duration-300 hover:text-white before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-black before:transition-transform before:duration-300 hover:before:scale-x-100 z-0"
          >
            {loginLoading ? "Logging in..." : "Admin Login"}
          </button>
          <p className="mt-4 text-sm text-zinc-500">
            Normal user?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-800">
              Login here
            </a>
          </p>
        </form>
      </main>
    );
  }

  if (accessDenied) {
    return (
      <main style={bgStyle} className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-zinc-600">
          This account is not an admin.
        </p>
        <a href="/dashboard" className="mt-4 inline-block">
          Go to dashboard 
        </a>
      </main>
    );
  }

  return (
    <main style={bgStyle} className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <button onClick={logout} className="text-sm">
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-3">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError("");
              loadPanel();
            }}
            className="mt-2 text-sm underline"
          >
            Retry
          </button>
        </div>
      )}

      {stats && (
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded border p-4">
            <p className="text-sm text-zinc-500">Total users</p>
            <p className="text-2xl font-semibold">{stats.totalUsers}</p>
          </div>
          <div className="rounded border p-4">
            <p className="text-sm text-zinc-500">Total todos</p>
            <p className="text-2xl font-semibold">{stats.totalTodos}</p>
          </div>
          <div className="rounded border p-4">
            <p className="text-sm text-zinc-500">Logged in now</p>
            <p className="text-2xl font-semibold">{stats.loggedInUsers}</p>
          </div>
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold">Users</h2>
      {users.length === 0 ? (
        <p className="text-zinc-500">No users yet.</p>
      ) : (
        <table className="mb-6 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Username</th>
              <th className="py-2">Signup date</th>
              <th className="py-2">Todos</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                onClick={() => {
                  setSelectedId(u.id);
                  setDetail(null);
                }}
                className={`cursor-pointer border-b hover:bg-zinc-50 ${
                  selectedId === u.id ? "bg-zinc-100" : ""
                }`}
              >
                <td className="py-2">{u.username}</td>
                <td className="py-2">
                  {new Date(u.createdAt).toLocaleString()}
                </td>
                <td className="py-2">{u.todoCount}</td>
                <td className="py-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      u.online ? "bg-green-500" : "bg-zinc-300"
                    }`}
                  />{" "}
                  {u.online ? "online" : "offline"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedId && (
        <div className="rounded border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {detail?.user.username ?? "User"}&apos;s todos
            </h3>
            <button
              onClick={() => {
                setSelectedId(null);
                setDetail(null);
              }}
              className="text-sm underline"
            >
              Close
            </button>
          </div>
          {detailLoading ? (
            <p>Loading...</p>
          ) : detail && detail.todos.length === 0 ? (
            <p className="text-zinc-500">No todos.</p>
          ) : detail ? (
            <ul className="space-y-2">
              {detail.todos.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-2 rounded border px-3 py-2"
                >
                  <input type="checkbox" checked={t.completed} readOnly />
                  <span className={t.completed ? "line-through text-zinc-400" : ""}>
                    {t.title}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </main>
  );
}