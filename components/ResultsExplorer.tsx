'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getProfileTheme } from '@/lib/theme/profile-theme';
import { type AdmissionOption, rankOptions, moveItem, exportList, safeUrl, sortResults, type ResultSort } from '@/lib/preferences';
import { schoolToMapsUrl } from '@/lib/maps';
import PreferencePicker from '@/components/PreferencePicker';
const SchoolMap = dynamic(() => import('@/components/SchoolMap'), { ssr: false, loading: () => <p className="p-4">Se încarcă harta…</p> });

const STORAGE = 'enroll-choices-v1';
const button = 'rounded-lg border border-ink/20 px-3 py-2 text-sm hover:bg-accent-soft/30 disabled:opacity-40';

type Props = { options: AdmissionOption[]; position: number | null };
type Preferences = { profiles: string[]; languages: string[]; saved: number[] };
const subscribe = () => () => {};

export default function ResultsExplorer(props: Props) {
    const mounted = useSyncExternalStore(subscribe, () => true, () => false);
    return mounted ? <Explorer {...props} /> : <main className="p-8 text-ink" role="status">Se încarcă opțiunile…</main>;
}

function readPreferences(options: AdmissionOption[]): Preferences {
    const empty = { profiles: [], languages: [], saved: [] };
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE) || '{}');
        if (!data || typeof data !== 'object') return empty;
        const validProfiles = new Set(options.map(o => o.profile));
        const validLanguages = new Set(options.map(o => o.language));
        const validIds = new Set(options.map(o => o.id));
        return {
            profiles: Array.isArray(data.profiles) ? [...new Set<string>(data.profiles.filter((v: unknown) => typeof v === 'string' && validProfiles.has(v)))] : [],
            languages: Array.isArray(data.languages) ? [...new Set<string>(data.languages.filter((v: unknown) => typeof v === 'string' && validLanguages.has(v)))] : [],
            saved: Array.isArray(data.saved) ? [...new Set<number>(data.saved.filter((v: unknown) => typeof v === 'number' && validIds.has(v)))] : [],
        };
    } catch { return empty; }
}

function Explorer({ options, position }: Props) {
    const [preferences, setPreferences] = useState(() => readPreferences(options));
    const { profiles, languages, saved } = preferences;
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<ResultSort>('name');
    const [status, setStatus] = useState('');
    const [storageError, setStorageError] = useState(false);
    function update(patch: Partial<Preferences>) {
        const next = { ...preferences, ...patch };
        setPreferences(next);
        try { localStorage.setItem(STORAGE, JSON.stringify(next)); setStorageError(false); }
        catch { setStorageError(true); }
    }
    const setProfiles = (profiles: string[]) => update({ profiles });
    const setLanguages = (languages: string[]) => update({ languages });
    const setSaved = (value: number[] | ((old: number[]) => number[])) => update({ saved: typeof value === 'function' ? value(saved) : value });
    const profileChoices = [...new Set(options.map(o => o.profile))].sort((a, b) => a.localeCompare(b, 'ro'));
    const languageChoices = [...new Set(options.map(o => o.language))].sort((a, b) => a.localeCompare(b, 'ro'));

    const ranked = useMemo(() => sortResults(rankOptions(options, profiles, languages, query), sort, position), [options, profiles, languages, query, sort, position]);
    const selected = saved.flatMap(id => { const option = options.find(o => o.id === id); return option ? [option] : []; });
    async function copy(value: string) {
        try { await navigator.clipboard.writeText(value); setStatus('Copiat în clipboard.'); }
        catch { setStatus('Copierea nu este disponibilă. Selectează textul manual sau descarcă lista.'); }
    }
    function download() {
        const url = URL.createObjectURL(new Blob(['\uFEFF' + exportList(selected)], { type: 'text/tab-separated-values;charset=utf-8' }));
        const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'lista-admitere.tsv'; anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    return <main lang="ro" className="min-h-screen bg-page px-4 py-8 text-ink sm:px-8">
        <div className="mx-auto max-w-7xl">
            <Link href="/" className="text-sm font-bold text-accent">Enroll</Link>
            <h1 className="mt-3 text-3xl font-bold">Alege liceul. Construiește-ți lista.</h1>
            <p className="mt-3 max-w-3xl text-ink-soft">Explorează liceele din București. Filtrează ce te interesează, compară opțiunile și construiește lista în ordinea în care le preferi.</p>
            {position && <p className="mt-2 text-sm">Poziția ta în ierarhia București 2026: {position}. Mai jos poți compara orientativ cu pozițiile istorice, pentru același județ.</p>}
            <p className="mt-2 text-sm text-ink-soft">Mediile afișate sunt istorice, nu garanții de admitere. Verifică oferta și codurile pentru anul în care aplici.</p>
            <details className="mt-4 rounded-2xl border border-ink/10 bg-white p-4 text-sm"><summary className="cursor-pointer font-semibold">Cum funcționează admiterea și comparația după poziție?</summary><p className="mt-3">Candidații sunt procesați în ordinea mediei de admitere și a criteriilor de departajare. Pentru fiecare candidat se verifică opțiunile în ordinea scrisă și se alege prima opțiune eligibilă cu loc disponibil. Pune în lista ta întâi ce îți dorești mai mult.</p><p className="mt-2">Poziția este județeană / a municipiului București, nu națională. Comparația cu ultimul admis din alt an este orientativă: locurile, preferințele și candidații se schimbă. Un număr mai mic înseamnă o poziție mai bună; diferența nu reprezintă o probabilitate de admitere.</p><p className="mt-2">Clasele bilingve pot necesita probă de limbă sau echivalare. Verifică cerințele și oferta din anul înscrierii.</p><div className="mt-3 flex gap-4"><a className="underline" href="https://legislatie.just.ro/Public/DetaliiDocument/301910" target="_blank" rel="noopener noreferrer">Regulile 2026–2027 ↗</a><a className="underline" href="https://www.plusedu.ro/calculator-admitere" target="_blank" rel="noopener noreferrer">Metoda PlusEdu ↗</a></div></details>
            <p className="mt-6 text-sm font-medium">Alege oricare dintre profilurile selectate ȘI oricare dintre limbile selectate. Fără selecție într-un grup = toate.</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
                <PreferencePicker title="1. Ce profiluri te interesează?" choices={profileChoices} selected={profiles} onChange={setProfiles} />
                <PreferencePicker title="2. Ce variante de limbă vrei să vezi?" choices={languageChoices} selected={languages} onChange={setLanguages} />
            </div>
            <p className="mt-2 text-xs text-ink-soft">Etichetele de limbă provin din datele istorice; verifică separat dacă o clasă este bilingvă, intensivă sau cu predare în altă limbă.</p>
            <div className="mt-6"><SchoolMap options={ranked} /></div>
            <p role="status" aria-live="polite" className="sticky top-0 z-10 min-h-8 rounded-lg bg-page py-2 text-sm font-medium">{status}</p>
            <p role="alert" className="text-sm text-oxblood">{storageError ? 'Salvarea nu este disponibilă: descarcă lista înainte de a închide pagina.' : ''}</p>
            <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <section aria-label="Specializări disponibile">
                    <label htmlFor="school-search" className="font-medium">Caută liceu sau specializare</label>
                    <input id="school-search" value={query} onChange={e => setQuery(e.target.value)} className="mt-2 w-full rounded-xl border border-ink/20 bg-white p-3" placeholder="Numele liceului…" />
                    <div className="my-4 flex flex-wrap items-center justify-between gap-3"><p>{ranked.length} specializări</p><label className="text-sm">Sortează după <select value={sort} onChange={e => setSort(e.target.value as ResultSort)} className="rounded-lg border border-ink/20 bg-white p-2"><option value="name">Numele liceului</option><option value="preferences">Preferințele mele</option><option value="grade">Ultima medie (descrescător)</option><option value="rank" disabled={!position}>Poziție istorică apropiată de a mea</option></select></label><button className={button} onClick={() => { update({ profiles: [], languages: [] }); setQuery(''); }}>Resetează filtrele</button></div>
                    {!ranked.length && <p className="rounded-xl bg-white p-6">Nicio specializare nu corespunde filtrelor. Încearcă alte profiluri sau limbi.</p>}
                    <div className="grid items-start gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        {ranked.map(o => {
                            const website = safeUrl(o.website);
                            const maps = schoolToMapsUrl(o.schoolName, o.address);
                            const theme = getProfileTheme(o.specialization);
                            return <article key={o.id} className="relative min-w-0 rounded-xl text-white shadow-sm ring-1 ring-black/5" style={{ backgroundImage: `linear-gradient(to top right, ${theme.accent}, #6b7280)` }}>
                                <details className="group">
                                    <summary className="cursor-pointer list-none rounded-xl p-3 pr-12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                                        <h2 className="text-sm font-bold leading-snug">{o.schoolName}</h2>
                                        <p className="mt-1 text-xs leading-snug text-white/90">{o.specialization}</p>
                                        <div className="mt-2 flex flex-wrap items-center gap-x-2 text-xs"><span>Medie {o.year}: <strong>{o.grade?.toFixed(2) ?? '—'}</strong></span><span className="text-white/80 group-open:hidden">Detalii ▾</span><span className="hidden text-white/80 group-open:inline">Închide ▴</span></div>
                                    </summary>
                                    <div className="space-y-2 border-t border-white/20 p-3 text-xs">
                                        <button className="underline" onClick={() => copy(o.schoolName)} aria-label={`Copiază numele: ${o.schoolName}`}>Copiază numele liceului</button>
                                        {o.lastRank != null && <p>Poziția ultimului admis ({o.year}): <strong>{o.lastRank}</strong>{position !== null && <span className="mt-1 block text-white/85">{position === o.lastRank ? 'Aceeași poziție numerică.' : position < o.lastRank ? `Tu: cu ${o.lastRank - position} poziții înainte.` : `Tu: cu ${position - o.lastRank} poziții după.`} Comparație între ani, fără garanție.</span>}</p>}
                                        <p>Cod admitere: {o.code ? <button className="underline" onClick={() => copy(o.code!)}>{o.code} ({o.codeYear})</button> : 'indisponibil'}</p>
                                        {o.codeSource && <a className="block underline" href={o.codeSource} target="_blank" rel="noopener noreferrer">Sursa codului ↗</a>}
                                        {o.address && <p className="text-white/85">{o.address}</p>}
                                        <div className="flex flex-wrap gap-x-3 gap-y-2 border-t border-white/20 pt-2">
                                            <a href={maps} target="_blank" rel="noopener noreferrer" className="underline">Deschide în Maps ↗</a>
                                            {website && <a href={website} target="_blank" rel="noopener noreferrer" className="underline">Site liceu ↗</a>}
                                            {o.detailsUrl && <a href={o.detailsUrl} target="_blank" rel="noopener noreferrer" className="underline">Detalii PlusEdu ↗</a>}
                                            {o.socialLinks.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="underline">{link.label} ↗</a>)}
                                        </div>
                                    </div>
                                </details>
                                <button disabled={saved.includes(o.id)} aria-label={`${saved.includes(o.id) ? 'În lista mea' : 'Adaugă în lista mea'}: ${o.schoolName}, ${o.specialization}`} title={saved.includes(o.id) ? 'În lista mea' : 'Adaugă în lista mea'} onClick={() => { setSaved(old => old.includes(o.id) ? old : [...old, o.id]); setStatus('Specializarea a fost adăugată în lista ta.'); }} className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-lg text-xl hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white disabled:opacity-60">{saved.includes(o.id) ? '✓' : '+'}</button>
                            </article>;
                        })}
                    </div>
                </section>
                <aside className="rounded-2xl border border-ink/10 bg-white p-5" aria-label="Lista mea">
                    <h2 className="text-xl font-bold">Lista mea · {selected.length}</h2>
                    <p className="mt-2 text-sm text-ink-soft">Pune opțiunile în ordinea în care le preferi. Lista se salvează pe acest dispozitiv; nu este o înscriere oficială.</p>
                    <button disabled={!ranked.length} className={`${button} mt-4`} onClick={() => { setSaved(old => [...new Set([...old, ...ranked.map(o => o.id)])]); setStatus('Rezultatele au fost adăugate în ordinea afișată. Poți reordona lista.'); }}>Adaugă rezultatele în ordinea afișată</button>
                    {!selected.length && <p className="my-6 text-sm">Adaugă specializări din rezultate pentru a începe.</p>}
                    <ol className="mt-4 space-y-4">
                        {selected.map((o, i) => <li key={o.id} className="border-t border-ink/10 pt-3">
                            <p className="font-semibold">{i + 1}. {o.schoolName}</p><p className="text-sm">{o.specialization}</p><p className="mt-1 text-sm">Cod: {o.code ?? 'indisponibil'}{o.codeYear ? ` (${o.codeYear})` : ''}</p>
                            <div className="mt-2 flex gap-2">
                                <button className={button} disabled={i === 0} aria-label={`Mută mai sus: ${o.schoolName}, ${o.specialization}`} onClick={() => setSaved(moveItem(saved, i, -1))}>↑</button>
                                <button className={button} disabled={i === selected.length - 1} aria-label={`Mută mai jos: ${o.schoolName}, ${o.specialization}`} onClick={() => setSaved(moveItem(saved, i, 1))}>↓</button>
                                <button className={button} aria-label={`Elimină: ${o.schoolName}, ${o.specialization}`} onClick={() => setSaved(saved.filter(id => id !== o.id))}>Elimină</button>
                            </div>
                        </li>)}
                    </ol>
                    <div className="mt-5 flex flex-wrap gap-2"><button className={button} disabled={!selected.length} onClick={() => copy(exportList(selected))}>Copiază lista</button><button className={button} disabled={!selected.length} onClick={download}>Descarcă TSV</button></div>
                    <a className="mt-4 block text-sm underline" href="https://admitere.edu.ro/" target="_blank" rel="noopener noreferrer">Verifică oferta oficială și codurile ↗</a>
                </aside>
            </div>
            <footer className="mt-10 border-t border-ink/10 pt-5 text-sm text-ink-soft">Date istorice din baza Enroll (bacplus.ro). Poziții istorice, coordonate completate și informații suplimentare: <a className="underline" href="https://www.plusedu.ro/" target="_blank" rel="noopener noreferrer">PlusEdu</a>. Codurile verificate indică sursa și anul.</footer>
        </div>
    </main>;
}
