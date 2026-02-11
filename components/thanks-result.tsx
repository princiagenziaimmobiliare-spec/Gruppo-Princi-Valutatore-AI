"use client";

import { useEffect, useState } from "react";

type Data = { valueCenter: number; valueMin: number; valueMax: number; ctaUrl: string };

export default function ThanksResult() {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    const raw = sessionStorage.getItem("valuationResult");
    if (raw) setData(JSON.parse(raw));
  }, []);
  if (!data) return <p>Dati non disponibili. Compila il form di valutazione.</p>;
  return (
    <div className="rounded bg-white p-6 shadow">
      <p className="text-lg">Valore centrale: <strong>€ {Math.round(data.valueCenter).toLocaleString("it-IT")}</strong></p>
      <p>Range stimato: € {Math.round(data.valueMin).toLocaleString("it-IT")} - € {Math.round(data.valueMax).toLocaleString("it-IT")}</p>
      <p className="mt-3 text-sm text-slate-600">Valutazione automatica basata su parametri di mercato e informazioni fornite. Consigliato sopralluogo per una stima professionale gratuita.</p>
      <a className="mt-5 inline-block rounded bg-brand px-4 py-2 text-white" href={data.ctaUrl}>Prenota sopralluogo gratuito / Contattaci</a>
    </div>
  );
}
