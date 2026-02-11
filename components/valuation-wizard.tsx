"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Locality = { id: string; comune: string; zona: string | null };

const defaultForm = {
  firstName: "", lastName: "", email: "", phone: "",
  street: "", streetNumber: "", cap: "", comune: "", provincia: "GO", zona: "",
  propertyType: "appartamento", mq: "", rooms: "", bathrooms: "", floor: "", hasElevator: "si",
  condition: "buono", buildYear: "", features: [] as string[], notes: "",
  consentData: false, consentContact: false, honeypot: ""
};

export default function ValuationWizard({ localities }: { localities: Locality[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");

  const comuni = useMemo(() => Array.from(new Set(localities.map((l) => l.comune))).sort(), [localities]);
  const zone = useMemo(() => localities.filter((l) => l.comune === form.comune && l.zona).map((l) => l.zona!) , [localities, form.comune]);

  const submit = async () => {
    setError("");
    const res = await fetch("/api/valuation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        mq: Number(form.mq), rooms: Number(form.rooms), bathrooms: Number(form.bathrooms),
        floor: form.floor ? Number(form.floor) : null,
        hasElevator: form.hasElevator === "si",
        buildYear: form.buildYear ? Number(form.buildYear) : null
      })
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Errore invio");
    sessionStorage.setItem("valuationResult", JSON.stringify(data));
    router.push("/grazie");
  };

  return (
    <div className="rounded bg-white p-6 shadow">
      <p className="mb-4 text-sm text-slate-500">Step {step} di 3</p>
      {step === 1 && <div className="space-y-3">
        <p className="rounded border-l-4 border-accent bg-amber-50 p-3 text-sm">I tuoi dati saranno inviati a Gruppo PRINCI come richiesta di valutazione e potresti essere contattato per un sopralluogo e una valutazione professionale gratuita.</p>
        {(["firstName","lastName","email","phone"] as const).map((k) => <input key={k} required className="w-full rounded border p-2" placeholder={k} value={(form as any)[k]} onChange={(e)=>setForm({...form,[k]:e.target.value})} />)}
      </div>}

      {step === 2 && <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded border p-2" placeholder="Via" value={form.street} onChange={(e)=>setForm({...form,street:e.target.value})}/>
        <input className="rounded border p-2" placeholder="Numero" value={form.streetNumber} onChange={(e)=>setForm({...form,streetNumber:e.target.value})}/>
        <input className="rounded border p-2" placeholder="CAP" value={form.cap} onChange={(e)=>setForm({...form,cap:e.target.value})}/>
        <select className="rounded border p-2" value={form.comune} onChange={(e)=>setForm({...form,comune:e.target.value,zona:""})}><option value="">Seleziona comune</option>{comuni.map((c)=><option key={c}>{c}</option>)}</select>
        <input className="rounded border p-2" value={form.provincia} readOnly />
        {zone.length > 0 && <select className="rounded border p-2" value={form.zona} onChange={(e)=>setForm({...form,zona:e.target.value})}><option value="">Zona/frazione</option>{zone.map((z)=><option key={z}>{z}</option>)}</select>}
        <select className="rounded border p-2" value={form.propertyType} onChange={(e)=>setForm({...form,propertyType:e.target.value})}><option value="appartamento">Appartamento</option><option value="casa_singola">Casa singola</option><option value="bifamiliare">Bifamiliare</option><option value="villetta_schiera">Villetta a schiera</option><option value="terreno">Terreno</option><option value="locale_commerciale">Locale commerciale</option></select>
        <input className="rounded border p-2" placeholder="Mq" value={form.mq} onChange={(e)=>setForm({...form,mq:e.target.value})}/>
        <input className="rounded border p-2" placeholder="N. locali" value={form.rooms} onChange={(e)=>setForm({...form,rooms:e.target.value})}/>
        <input className="rounded border p-2" placeholder="N. bagni" value={form.bathrooms} onChange={(e)=>setForm({...form,bathrooms:e.target.value})}/>
        <input className="rounded border p-2" placeholder="Piano" value={form.floor} onChange={(e)=>setForm({...form,floor:e.target.value})}/>
        <select className="rounded border p-2" value={form.hasElevator} onChange={(e)=>setForm({...form,hasElevator:e.target.value})}><option value="si">Ascensore: Sì</option><option value="no">Ascensore: No</option></select>
        <select className="rounded border p-2" value={form.condition} onChange={(e)=>setForm({...form,condition:e.target.value})}><option value="da_ristrutturare">Da ristrutturare</option><option value="discreto">Discreto</option><option value="buono">Buono</option><option value="ottimo">Ottimo</option><option value="nuovo">Nuovo</option></select>
        <input className="rounded border p-2" placeholder="Anno costruzione (opzionale)" value={form.buildYear} onChange={(e)=>setForm({...form,buildYear:e.target.value})}/>
        <textarea className="rounded border p-2 md:col-span-2" placeholder="Note" value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})}/>
        <div className="md:col-span-2">
          {[["garage","Garage"],["posto_auto","Posto auto"],["cantina","Cantina"],["soffitta","Soffitta"],["giardino","Giardino"],["terrazzo_balcone","Terrazzo/Balcone"]].map(([v,l])=> <label key={v} className="mr-4 inline-flex items-center gap-1"><input type="checkbox" checked={form.features.includes(v)} onChange={(e)=>setForm({...form,features:e.target.checked?[...form.features,v]:form.features.filter((f)=>f!==v)})}/>{l}</label>)}
        </div>
      </div>}

      {step === 3 && <div className="space-y-3">
        <p className="text-sm">Controlla i dati e conferma i consensi obbligatori.</p>
        <label className="flex gap-2"><input type="checkbox" checked={form.consentData} onChange={(e)=>setForm({...form,consentData:e.target.checked})}/>Dichiaro di aver letto l'<a href="/privacy" className="underline">Informativa Privacy</a> e accetto che i miei dati siano ricevuti e conservati da Gruppo PRINCI per gestire la richiesta.</label>
        <label className="flex gap-2"><input type="checkbox" checked={form.consentContact} onChange={(e)=>setForm({...form,consentContact:e.target.checked})}/>Accetto di essere contattato da Gruppo PRINCI per approfondire i dettagli e proporre sopralluogo e valutazione professionale gratuita.</label>
        <input className="hidden" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={(e)=>setForm({...form,honeypot:e.target.value})} />
      </div>}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-6 flex justify-between">
        <button type="button" className="rounded border px-4 py-2" disabled={step===1} onClick={()=>setStep(step-1)}>Indietro</button>
        {step < 3 ? <button type="button" className="rounded bg-brand px-4 py-2 text-white" onClick={()=>setStep(step+1)}>Avanti</button> : <button type="button" className="rounded bg-brand px-4 py-2 text-white" onClick={submit}>Invia richiesta</button>}
      </div>
    </div>
  );
}
