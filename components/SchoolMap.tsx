'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type AdmissionOption } from '@/lib/preferences';
import { schoolToMapsUrl } from '@/lib/maps';
import { getProfileTheme } from '@/lib/theme/profile-theme';

export default function SchoolMap({ options }: { options: AdmissionOption[] }) {
    const container = useRef<HTMLDivElement>(null);
    const [location, setLocation] = useState<{ lat: number; lon: number; accuracy: number } | null>(null);
    const [status, setStatus] = useState('');
    const [busy, setBusy] = useState(false);
    const schools = useMemo(() => {
        const grouped = new Map<number, AdmissionOption[]>();
        for (const option of options) grouped.set(option.schoolId, [...(grouped.get(option.schoolId) ?? []), option]);
        return [...grouped.values()];
    }, [options]);
    const mapped = schools.filter(([s]) => s.latitude !== null && s.longitude !== null);
    useEffect(() => {
        if (!container.current) return;
        const map = L.map(container.current, { scrollWheelZoom: false, zoomAnimation: false, fadeAnimation: false, markerZoomAnimation: false }).setView([44.435, 26.10], 12);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }).addTo(map);
        const bounds = L.latLngBounds([]);
        for (const group of schools) {
            const s = group[0];
            if (s.latitude === null || s.longitude === null) continue;
            const point: L.LatLngTuple = [s.latitude, s.longitude];
            bounds.extend(point);
            const accent = getProfileTheme(s.profile).accent;
            const color = accent.startsWith('var(') ? getComputedStyle(document.documentElement).getPropertyValue(accent.slice(4, -1)).trim() : accent;
            const marker = L.circleMarker(point, { radius: 8, color: '#fff', weight: 2, fillColor: color, fillOpacity: 1 }).addTo(map);
            const label = document.createElement('span'); label.textContent = s.schoolName;
            marker.bindTooltip(label, { permanent: true, direction: 'top', className: 'school-map-label' });
            const popup = document.createElement('div');
            const name = document.createElement('strong'); name.textContent = s.schoolName; popup.append(name);
            const profiles = document.createElement('p'); profiles.textContent = group.map(o => o.specialization).join(' · '); popup.append(profiles);
            const link = document.createElement('a'); link.textContent = 'Deschide liceul în Google Maps ↗'; link.href = schoolToMapsUrl(s.schoolName, s.address); link.target = '_blank'; link.rel = 'noopener noreferrer'; popup.append(link);
            marker.bindPopup(popup);
        }
        if (location) {
            const point: L.LatLngTuple = [location.lat, location.lon]; bounds.extend(point);
            L.circleMarker(point, { radius: 9, color: '#fff', fillColor: '#2563eb', fillOpacity: 1, weight: 3 }).addTo(map).bindTooltip('Tu ești aici', { permanent: true });
            L.circle(point, { radius: location.accuracy, weight: 1, color: '#2563eb', fillOpacity: .08 }).addTo(map);
        }
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14, animate: false });
        const observer = new ResizeObserver(() => map.invalidateSize()); observer.observe(container.current);
        return () => { observer.disconnect(); map.remove(); };
    }, [schools, location]);
    function locate() {
        if (!navigator.geolocation) { setStatus('Browserul nu oferă localizare.'); return; }
        setBusy(true); setStatus('Se caută poziția…');
        navigator.geolocation.getCurrentPosition(p => {
            setLocation({ lat: p.coords.latitude, lon: p.coords.longitude, accuracy: p.coords.accuracy });
            setStatus('Poziția ta este marcată în albastru.'); setBusy(false);
        }, e => { setStatus(e.code === 1 ? 'Localizarea a fost refuzată. Poți permite accesul din setările browserului.' : 'Locația nu este disponibilă. Încearcă din nou.'); setBusy(false); }, { timeout: 10000, maximumAge: 60000 });
    }
    return <section className="overflow-hidden rounded-2xl border border-ink/10 bg-white" aria-label="Harta liceelor filtrate">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div><h2 className="font-bold">Liceele de pe hartă</h2><p className="text-sm text-ink-soft">{mapped.length} licee · aceleași filtre ca în listă{schools.length > mapped.length ? ` · ${schools.length - mapped.length} fără coordonate` : ''}</p></div>
            <button className="rounded-xl bg-ink px-4 py-2 text-sm text-white disabled:opacity-50" onClick={locate} disabled={busy}>{busy ? 'Localizare…' : 'Arată și poziția mea'}</button>
        </div>
        <div ref={container} className="relative z-0 h-[420px] w-full" aria-label="Hartă interactivă OpenStreetMap" />
        <p role="status" className="px-4 pt-2 text-sm">{status}</p>
        <p className="p-4 text-xs text-ink-soft">Numele sunt afișate direct pe hartă. Un punct grupează specializările aceluiași liceu; culoarea este a primei specializări afișate. Localizarea este opțională și nu se salvează. Harta folosește OpenStreetMap.</p>
    </section>;
}
