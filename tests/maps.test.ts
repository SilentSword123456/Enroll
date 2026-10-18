import assert from 'node:assert/strict';
import test from 'node:test';
import { schoolToMapsUrl } from '../lib/maps.ts';
test('Maps searches for the school with address or city context', () => {
    const url = new URL(schoolToMapsUrl('Colegiul Șincai', 'Calea Șerban Vodă 167'));
    assert.equal(url.searchParams.get('query'), 'Colegiul Șincai, Calea Șerban Vodă 167');
    assert.equal(new URL(schoolToMapsUrl('Șincai')).searchParams.get('query'), 'Șincai, București, România');
    assert.equal(new URL(schoolToMapsUrl('Șincai', null, 'verified-id')).searchParams.get('query_place_id'), 'verified-id');
});
