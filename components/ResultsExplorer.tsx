'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { type AdmissionOption, rankOptions, moveItem, exportList, safeUrl } from '@/lib/preferences';
import { addressToMapsUrl } from '@/lib/maps';
import PreferencePicker from '@/components/PreferencePicker';
import LocationMap from '@/components/LocationMap';

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

    const ranked = rankOptions(options, profiles, languages, query);
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
            <p className="mt-3 max-w-3xl text-ink-soft">Alege profilurile și limbile în ordinea preferată, apoi adaugă specializările în lista ta. Ordinea profilurilor are prioritate față de ordinea limbilor.</p>
            {position && <p className="mt-2 text-sm">Poziția introdusă: {position}. Datele disponibile nu permit calcularea unei probabilități de admitere din această poziție.</p>}
            <p className="mt-2 text-sm text-ink-soft">Mediile afișate sunt istorice, nu garanții de admitere. Verifică oferta și codurile pentru anul în care aplici.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <PreferencePicker title="Profiluri, în ordinea preferată" choices={profileChoices} selected={profiles} onChange={setProfiles} />
                <PreferencePicker title="Limbi / opțiuni bilingve, în ordinea preferată" choices={languageChoices} selected={languages} onChange={setLanguages} />
            </div>
            <p className="mt-2 text-xs text-ink-soft">Etichetele de limbă provin din datele istorice; verifică separat dacă o clasă este bilingvă, intensivă sau cu predare în altă limbă.</p>
            <div className="mt-6"><LocationMap /></div>
            <p role="status" aria-live="polite" className="sticky top-0 z-10 min-h-8 rounded-lg bg-page py-2 text-sm font-medium">{status}</p>
            <p role="alert" className="text-sm text-oxblood">{storageError ? 'Salvarea nu este disponibilă: descarcă lista înainte de a închide pagina.' : ''}</p>
            <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <section aria-label="Specializări disponibile">
                    <label htmlFor="school-search" className="font-medium">Caută liceu sau specializare</label>
                    <input id="school-search" value={query} onChange={e => setQuery(e.target.value)} className="mt-2 w-full rounded-xl border border-ink/20 bg-white p-3" placeholder="Numele liceului…" />
                    <div className="my-4 flex items-center justify-between"><p>{ranked.length} specializări</p><button className={button} onClick={() => { update({ profiles: [], languages: [] }); setQuery(''); }}>Resetează filtrele</button></div>
                    {!ranked.length && <p className="rounded-xl bg-white p-6">Nicio specializare nu corespunde filtrelor. Încearcă alte profiluri sau limbi.</p>}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {ranked.map(o => {
                            const website = safeUrl(o.website);
                            const maps = o.latitude !== null && o.longitude !== null ? addressToMapsUrl(`${o.latitude},${o.longitude}`) : addressToMapsUrl(o.address || `${o.schoolName}, București`);
                            return <article key={o.id} className="flex flex-col rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                                <h2 className="text-lg font-bold"><button className="text-left underline-offset-4 hover:underline" title="Copiază numele liceului" aria-label={`Copiază numele: ${o.schoolName}`} onClick={() => copy(o.schoolName)}>{o.schoolName}</button></h2>
                                <p className="mt-2 font-medium text-accent-deep">{o.specialization}</p>
                                <p className="mt-2 text-sm">Ultima medie ({o.year}): <strong>{o.grade?.toFixed(2) ?? 'Indisponibilă'}</strong></p>
                                <p className="mt-1 text-sm">Cod admitere: {o.code ? <button className="underline" onClick={() => copy(o.code!)}>{o.code} ({o.codeYear})</button> : 'indisponibil'}</p>
                                {o.codeSource && <a className="text-xs underline" href={o.codeSource} target="_blank" rel="noopener noreferrer">Sursa codului ↗</a>}
                                {o.address && <p className="mt-3 text-sm text-ink-soft">{o.address}</p>}
                                <div className="mt-3 flex flex-wrap gap-3 text-sm text-accent-deep">
                                    <a href={maps} target="_blank" rel="noopener noreferrer" className="underline">Deschide în Maps ↗</a>
                                    {website && <a href={website} target="_blank" rel="noopener noreferrer" className="underline">Site liceu ↗</a>}
                                    {o.detailsUrl && <a href={o.detailsUrl} target="_blank" rel="noopener noreferrer" className="underline">Detalii PlusEdu ↗</a>}
                                    {o.socialLinks.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="underline">{link.label} ↗</a>)}
                                </div>
                                <button disabled={saved.includes(o.id)} onClick={() => { setSaved(old => old.includes(o.id) ? old : [...old, o.id]); setStatus('Specializarea a fost adăugată în lista ta.'); }} className="mt-4 rounded-xl bg-ink px-4 py-2 text-sm text-white disabled:opacity-40">{saved.includes(o.id) ? 'În lista mea' : 'Adaugă în lista mea'}</button>
                            </article>;
                        })}
                    </div>
                </section>
                <aside className="rounded-2xl border border-ink/10 bg-white p-5" aria-label="Lista mea">
                    <h2 className="text-xl font-bold">Lista mea · {selected.length}</h2>
                    <p className="mt-2 text-sm text-ink-soft">Pune opțiunile în ordinea în care le preferi. Lista se salvează pe acest dispozitiv; nu este o înscriere oficială.</p>
                    <button disabled={!ranked.length} className={`${button} mt-4`} onClick={() => { setSaved(old => [...new Set([...old, ...ranked.map(o => o.id)])]); setStatus('Rezultatele au fost adăugate în ordinea preferințelor. Poți reordona lista.'); }}>Adaugă rezultatele în ordinea preferințelor</button>
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
            <footer className="mt-10 border-t border-ink/10 pt-5 text-sm text-ink-soft">Date istorice din baza Enroll (bacplus.ro). Coordonate completate și informații suplimentare: <a className="underline" href="https://www.plusedu.ro/" target="_blank" rel="noopener noreferrer">PlusEdu</a>. Codurile verificate indică sursa și anul.</footer>
        </div>
    </main>;
}
