import Link from "next/link";

export default function HomePage() {
  return (
    <section className="container-page py-16">
      <h1 className="text-4xl font-bold text-brand">Valutazione Gratuita – Gruppo PRINCI</h1>
      <p className="mt-4 max-w-2xl text-lg">Scopri il valore indicativo del tuo immobile in Provincia di Gorizia (GO) in pochi passaggi.</p>
      <Link href="/valutazione" className="mt-8 inline-block rounded bg-brand px-5 py-3 font-medium text-white">Inizia la valutazione</Link>
    </section>
  );
}
