'use client';

import { useState } from 'react';

export default function LocationMap() {
    const [location, setLocation] = useState<{ lat: number; lon: number; accuracy: number } | null>(null);
    const [status, setStatus] = useState('');
    const [busy, setBusy] = useState(false);
    function locate() {
        if (!navigator.geolocation) { setStatus('Browserul nu oferă localizare.'); return; }
        setBusy(true); setStatus('Se caută poziția…');
        navigator.geolocation.getCurrentPosition(p => {
            setLocation({ lat: p.coords.latitude, lon: p.coords.longitude, accuracy: p.coords.accuracy });
            setStatus('Poziția ta este marcată pe hartă.'); setBusy(false);
        }, error => {
            setStatus(error.code === 1 ? 'Accesul la locație a fost refuzat. Îl poți permite din setările browserului.' : 'Locația nu este disponibilă. Încearcă din nou.'); setBusy(false);
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
    }
    const bbox = location ? [Math.max(-180, location.lon - .015), Math.max(-90, location.lat - .01), Math.min(180, location.lon + .015), Math.min(90, location.lat + .01)].join(',') : '';
    return <section className="rounded-2xl border border-ink/10 bg-white p-4" aria-label="Locația mea">
        <button type="button" onClick={locate} disabled={busy} className="rounded-xl bg-ink px-4 py-2 text-white disabled:opacity-50">{busy ? 'Localizare…' : 'Arată poziția mea pe hartă'}</button>
        <p className="mt-2 text-xs text-ink-soft">Cu acordul tău, harta OpenStreetMap primește coordonatele pentru afișare. Nu salvăm locația.</p>
        <p role="status" className="mt-2 text-sm">{status}</p>
        {location && <div className="mt-3">
            <iframe title="Poziția mea pe hartă" className="h-72 w-full rounded-xl border-0" referrerPolicy="no-referrer" src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${location.lat},${location.lon}`} />
            <p className="mt-2 text-xs text-ink-soft">Precizie aproximativă: {Math.round(location.accuracy)} m.</p>
            <a className="text-sm underline" href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}`} target="_blank" rel="noopener noreferrer">Deschide poziția în Maps ↗</a>
        </div>}
    </section>;
}
