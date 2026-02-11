"use client";

import { useEffect, useState } from "react";

type Coeff = { id: string; group: string; key: string; label: string; value: number };

type Payload = { settings: { rangePercentage: number; provinceFallbackPrice: number; ctaUrl: string; contactEmail: string; contactPhone: string }; coefficients: Coeff[] };

export default function ParametriManager() {
  const [data, setData] = useState<Payload | null>(null);

  const load = async () => setData(await (await fetch("/api/admin/parametri")).json());
  useEffect(() => { load(); }, []);

  if (!data) return <p>Caricamento...</p>;

  return <div className="space-y-4"><div className="grid gap-2 md:grid-cols-2"><input type="number" className="rounded border p-2" value={data.settings.rangePercentage} onChange={(e)=>setData({...data,settings:{...data.settings,rangePercentage:Number(e.target.value)}})} /><input type="number" className="rounded border p-2" value={data.settings.provinceFallbackPrice} onChange={(e)=>setData({...data,settings:{...data.settings,provinceFallbackPrice:Number(e.target.value)}})} /><input className="rounded border p-2" value={data.settings.ctaUrl} onChange={(e)=>setData({...data,settings:{...data.settings,ctaUrl:e.target.value}})} /><input className="rounded border p-2" value={data.settings.contactEmail} onChange={(e)=>setData({...data,settings:{...data.settings,contactEmail:e.target.value}})} /></div><table className="w-full bg-white text-sm"><thead><tr><th>Gruppo</th><th>Chiave</th><th>Etichetta</th><th>Valore</th></tr></thead><tbody>{data.coefficients.map((c, idx)=><tr key={c.id} className="border-t"><td>{c.group}</td><td>{c.key}</td><td><input className="rounded border p-1" value={c.label} onChange={(e)=>{const coefficients=[...data.coefficients];coefficients[idx]={...c,label:e.target.value};setData({...data,coefficients});}} /></td><td><input type="number" step="0.01" className="rounded border p-1" value={c.value} onChange={(e)=>{const coefficients=[...data.coefficients];coefficients[idx]={...c,value:Number(e.target.value)};setData({...data,coefficients});}} /></td></tr>)}</tbody></table><button className="rounded bg-brand px-4 py-2 text-white" onClick={async()=>{await fetch('/api/admin/parametri',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});}}>Salva parametri</button></div>;
}
