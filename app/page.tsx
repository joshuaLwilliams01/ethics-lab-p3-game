import Link from "next/link";
export default function Home(){
  return (
    <section className="py-10 space-y-6">
      <h1 className="text-3xl font-bold">Ethics Lab: People · Planet · Parity</h1>
      <p className="text-lg max-w-2xl">
        Practice ethical decision-making on real tech dilemmas using the Stanford Ethics Toolkit and the People · Planet · Parity (P3) framework.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/play" className="px-4 py-2 rounded bg-black text-white">Start Playing</Link>
        <Link href="/about" className="px-4 py-2 rounded border">Credits</Link>
      </div>
    </section>
  );
}

