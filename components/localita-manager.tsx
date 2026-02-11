"use client";

import { useEffect, useState } from "react";

type Item = { id: string; comune: string; zona: string | null; basePriceEur: number; isActive: boolean };

export default function LocalitaManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({ comune: "", zona: "", basePriceEur: 0, isActive: true });

  const load = async () => setItems(await (await fetch("/api/admin/localita")).json());
  useEffect(() => { load(); }, []);

  const save = async () => {
    await fetch("/api/admin/localita", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ comune: "", zona: "", basePriceEur: 0, isActive: true });
    load();
  };

  return <div className="space-y-4"><div className="grid gap-2 md:grid-cols-4"><input className="rounded border p-2" placeholder="Comune" value={form.comune} onChange={(e)=>setForm({...form,comune:e.target.value})}/><input className="rounded border p-2" placeholder="Zona" value={form.zona} onChange={(e)=>setForm({...form,zona:e.target.value})}/><input type="number" className="rounded border p-2" placeholder="€/mq" value={form.basePriceEur} onChange={(e)=>setForm({...form,basePriceEur:Number(e.target.value)})}/><button onClick={save} className="rounded bg-brand px-3 py-2 text-white">Aggiungi</button></div><table className="w-full bg-white text-sm"><thead><tr><th>Comune</th><th>Zona</th><th>€/mq</th><th>Attivo</th><th></th></tr></thead><tbody>{items.map((i)=><tr key={i.id} className="border-t"><td>{i.comune}</td><td>{i.zona||"-"}</td><td>{i.basePriceEur}</td><td>{i.isActive?"Sì":"No"}</td><td><button onClick={async()=>{await fetch(`/api/admin/localita?id=${i.id}`,{method:"DELETE"});load();}} className="text-red-600">Elimina</button></td></tr>)}</tbody></table></div>;
}
