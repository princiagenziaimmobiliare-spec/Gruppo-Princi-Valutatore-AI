import Link from "next/link";

export default function AdminNav() {
  return (
    <div className="mb-6 flex gap-3 text-sm">
      <Link className="rounded border px-3 py-1" href="/admin/localita">Località</Link>
      <Link className="rounded border px-3 py-1" href="/admin/parametri">Parametri</Link>
      <Link className="rounded border px-3 py-1" href="/admin/richieste">Richieste</Link>
    </div>
  );
}
