"use client";

import { useEffect, useState } from "react";

type Row = { id: string; createdAt: string; firstName: string; lastName: string; comune: string; propertyType: string; phone: string; valuationCenter: number };

export default function RichiesteManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filters, setFilters] = useState({ comune: "", tipologia: "", from: "", to: "" });
  const [selected, setSelected] = useState<Row | null>(null);

  const load = async () => {
    const q = new URLSearchParams(filters as Record<string, string>);
    setRows(await (await fetch(`/api/admin/richieste?${q.toString()}`)).json());
  };

  useEffect(() => { load(); }, []);

  return <div className="space-y-4"><div className="grid gap-2 md:grid-cols-5"><input className="rounded border p-2" placeholder="Comune" value={filters.comune} onChange={(e)=>setFilters({...filters,comune:e.target.value})}/><input className="rounded border p-2" placeholder="Tipologia" value={filters.tipologia} onChange={(e)=>setFilters({...filters,tipologia:e.target.value})}/><input type="date" className="rounded border p-2" value={filters.from} onChange={(e)=>setFilters({...filters,from:e.target.value})}/><input type="date" className="rounded border p-2" value={filters.to} onChange={(e)=>setFilters({...filters,to:e.target.value})}/><button onClick={load} className="rounded bg-brand px-3 py-2 text-white">Filtra</button></div><a href="/api/admin/richieste/export" className="inline-block rounded border px-3 py-2">Export CSV</a><table className="w-full bg-white text-sm"><thead><tr><th>Data</th><th>Nominativo</th><th>Comune</th><th>Tipologia</th><th>Telefono</th><th>Valore</th></tr></thead><tbody>{rows.map((r)=><tr key={r.id} className="cursor-pointer border-t" onClick={()=>setSelected(r)}><td>{new Date(r.createdAt).toLocaleString('it-IT')}</td><td>{r.firstName} {r.lastName}</td><td>{r.comune}</td><td>{r.propertyType}</td><td>{r.phone}</td><td>€ {Math.round(r.valuationCenter).toLocaleString('it-IT')}</td></tr>)}</tbody></table>{selected && <div className="rounded border bg-white p-3 text-sm">Dettaglio: {selected.firstName} {selected.lastName} - {selected.comune} - {selected.propertyType}</div>}</div>;
}
