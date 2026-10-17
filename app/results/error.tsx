'use client';

export default function ResultsError({ reset }: { reset: () => void }) {
    return <main lang="ro" className="min-h-screen bg-page p-8 text-ink">
        <h1 className="text-2xl font-bold">Nu am putut încărca liceele</h1>
        <p className="mt-3">Încearcă din nou în câteva momente. Lista ta salvată în browser nu a fost ștearsă.</p>
        <button onClick={reset} className="mt-5 rounded-xl bg-ink px-4 py-2 text-white">Încearcă din nou</button>
    </main>;
}
