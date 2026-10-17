'use client';

import { moveItem } from '@/lib/preferences';

export default function PreferencePicker({ title, choices, selected, onChange }: { title: string; choices: string[]; selected: string[]; onChange: (values: string[]) => void }) {
    return <fieldset className="rounded-2xl border border-ink/10 bg-white p-4">
        <legend className="px-2 font-semibold">{title}</legend>
        <p className="mb-3 text-sm text-ink-soft">Selectează mai multe. Prima alegere are prioritate. Fără selecție: toate.</p>
        <div className="max-h-48 space-y-2 overflow-auto">
            {choices.map(choice => <label key={choice} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={selected.includes(choice)} onChange={() => onChange(selected.includes(choice) ? selected.filter(v => v !== choice) : [...selected, choice])} />{choice}
            </label>)}
        </div>
        {selected.length > 0 && <ol className="mt-4 space-y-2 border-t border-ink/10 pt-3">
            {selected.map((choice, i) => <li key={choice} className="flex items-center gap-2 text-sm">
                <span className="flex-1">{i + 1}. {choice}</span>
                <button type="button" className="rounded border px-2 py-1 disabled:opacity-30" disabled={i === 0} aria-label={`Crește prioritatea: ${choice}`} onClick={() => onChange(moveItem(selected, i, -1))}>↑</button>
                <button type="button" className="rounded border px-2 py-1 disabled:opacity-30" disabled={i === selected.length - 1} aria-label={`Scade prioritatea: ${choice}`} onClick={() => onChange(moveItem(selected, i, 1))}>↓</button>
            </li>)}
        </ol>}
    </fieldset>;
}
