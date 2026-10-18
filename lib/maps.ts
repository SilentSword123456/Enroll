export function addressToMapsUrl(address: string) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/** Search for the institution, never a bare coordinate pin. */
export function schoolToMapsUrl(name: string, address?: string | null, placeId?: string | null) {
    const params = new URLSearchParams({ api: '1', query: `${name}, ${address || 'București, România'}` });
    if (placeId) params.set('query_place_id', placeId);
    return `https://www.google.com/maps/search/?${params}`;
}
