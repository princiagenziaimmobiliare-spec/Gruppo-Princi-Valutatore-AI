"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    if (!res.ok) return setError("Credenziali errate");
    router.push("/admin/localita");
  };

  return (
    <section className="container-page py-12">
      <h1 className="mb-4 text-3xl font-bold">Admin login</h1>
      <form onSubmit={login} className="max-w-md space-y-3 rounded bg-white p-6 shadow">
        <input className="w-full rounded border p-2" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <input type="password" className="w-full rounded border p-2" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="rounded bg-brand px-4 py-2 text-white">Accedi</button>
      </form>
    </section>
  );
}
