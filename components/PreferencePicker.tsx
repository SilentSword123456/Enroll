'use client';
import { moveItem } from '@/lib/preferences';

export default function PreferencePicker({ title, choices, selected, onChange }: { title: string; choices: string[]; selected: string[]; onChange: (values: string[]) => void }) {
    return <fieldset className="rounded-2xl border border-ink/10 bg-white p-4">
        <legend className="px-2 font-semibold">{title}</legend>
        <div className="mb-3 flex items-center justify-between gap-2 text-sm"><span>{selected.length ? `${selected.length} selectate` : 'Toate sunt afișate'}</span><button type="button" className="underline" onClick={() => onChange([])}>Arată toate</button></div>
        <div className="flex max-h-48 flex-wrap gap-2 overflow-auto">
            {choices.map(choice => <button type="button" key={choice} aria-pressed={selected.includes(choice)} onClick={() => onChange(selected.includes(choice) ? selected.filter(v => v !== choice) : [...selected, choice])} className={`rounded-full border px-3 py-2 text-sm transition-colors ${selected.includes(choice) ? 'border-accent bg-accent text-white' : 'border-ink/15 bg-page text-ink hover:border-accent'}`}>{selected.includes(choice) ? '✓ ' : ''}{choice}</button>)}
        </div>
        {selected.length > 1 && <details className="mt-4 text-sm"><summary className="cursor-pointer text-accent-deep">Ordinea preferințelor (opțional)</summary>
            <p className="my-2 text-ink-soft">Se aplică doar când alegi sortarea „Preferințele mele”. Nu schimbă lista de înscriere deja salvată.</p>
            <ol className="space-y-2">{selected.map((choice, i) => <li key={choice} className="flex items-center gap-2"><span className="flex-1">{i + 1}. {choice}</span><button type="button" className="rounded border px-2 py-1 disabled:opacity-30" disabled={i === 0} aria-label={`Crește prioritatea: ${choice}`} onClick={() => onChange(moveItem(selected, i, -1))}>↑</button><button type="button" className="rounded border px-2 py-1 disabled:opacity-30" disabled={i === selected.length - 1} aria-label={`Scade prioritatea: ${choice}`} onClick={() => onChange(moveItem(selected, i, 1))}>↓</button></li>)}</ol>
        </details>}
    </fieldset>;
}
