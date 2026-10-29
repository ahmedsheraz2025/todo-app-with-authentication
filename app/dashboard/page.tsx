"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetch("/api/todos");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (active) {
        setTodos(data);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const todo = await res.json();
      setTodos((prev) => [todo, ...prev]);
      setTitle("");
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to add");
    }
  }

  async function toggleTodo(todo: Todo) {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    }
  }

  async function deleteTodo(id: string) {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Todos</h1>
        <button onClick={logout} className="text-sm underline">
          Logout
        </button>
      </div>

      <form onSubmit={addTodo} className="mb-6 flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="New todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="rounded bg-black px-4 py-2 text-white">Add</button>
      </form>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-zinc-500">No todos yet.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between rounded border px-3 py-2"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                />
                <span className={todo.completed ? "line-through text-zinc-400" : ""}>
                  {todo.title}
                </span>
              </label>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
