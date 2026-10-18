export function MapSkeleton() {
    return <div role="status" aria-label="Se încarcă harta" className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <div className="h-20 border-b border-ink/10 bg-ink/5 motion-safe:animate-pulse" />
        <div className="flex h-[420px] items-center justify-center bg-ink/5 text-sm text-ink-soft">Se încarcă harta…</div>
        <div className="h-20 bg-ink/5 motion-safe:animate-pulse" />
    </div>;
}

export default function ResultsSkeleton() {
    return <main lang="ro" aria-busy="true" className="min-h-screen bg-page px-4 py-8 text-ink sm:px-8">
        <div className="mx-auto max-w-7xl">
            <p role="status" className="sr-only">Se încarcă liceele…</p>
            <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
                <div className="h-5 w-14 rounded bg-accent/20" />
                <div className="h-9 w-3/4 rounded-lg bg-ink/10" />
                <div className="h-12 max-w-3xl rounded-lg bg-ink/5" />
                <div className="grid gap-4 md:grid-cols-2">{[0, 1].map(i => <div key={i} className="h-28 rounded-2xl border border-ink/10 bg-white p-4"><div className="h-4 w-1/2 rounded bg-ink/10" /><div className="mt-5 h-8 w-4/5 rounded-full bg-ink/5" /></div>)}</div>
                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 9 }, (_, i) => <div key={i} className="rounded-xl border border-ink/10 bg-white p-3"><div className="h-4 w-4/5 rounded bg-ink/10" /><div className="mt-2 h-3 w-3/5 rounded bg-ink/5" /><div className="mt-3 h-3 w-2/5 rounded bg-ink/5" /><div className="mt-3 h-7 rounded-full bg-ink/5" /></div>)}</div>
                    <div className="h-48 rounded-2xl border border-ink/10 bg-white" />
                </div>
            </div>
        </div>
    </main>;
}
