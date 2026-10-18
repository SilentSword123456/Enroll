import assert from 'node:assert/strict';
import test from 'node:test';
import { sortResults, rankOptions, splitSpecialization, moveItem, safeUrl, exportList, type AdmissionOption } from '../lib/preferences.ts';

const option = (id: number, profile: string, language: string, schoolName: string): AdmissionOption => ({ id, schoolId: id, schoolSlug: 'school', schoolName, specialization: profile, profile, language, year: 2026, grade: null, address: null, website: null, latitude: null, longitude: null, code: null, codeYear: null, codeSource: null, socialLinks: [] });
const options = [option(1, 'Real', 'Engleză', 'Z'), option(2, 'Uman', 'Franceză', 'A'), option(3, 'Real', 'Franceză', 'B'), option(4, 'Real', 'Engleză', 'A')];
test('profile priority comes first, then language, then school name', () => {
    assert.deepEqual(rankOptions(options, ['Real', 'Uman'], ['Engleză', 'Franceză']).map(o => o.id), [4, 1, 3, 2]);
    assert.deepEqual(rankOptions(options, ['Uman', 'Real'], ['Franceză', 'Engleză']).map(o => o.id), [2, 3, 4, 1]);
});
test('multiple selected profiles and languages filter independently', () => {
    assert.deepEqual(rankOptions(options, ['Real'], ['Franceză']).map(o => o.id), [3]);
    assert.equal(rankOptions(options, [], []).length, 4);
    assert.equal(rankOptions(options, ['Missing'], []).length, 0);
});
test('search ignores Romanian diacritics and specialization splits language without guessing bilingual status', () => {
    assert.equal(rankOptions([option(5, 'Real', '', 'Șincai')], [], [], 'sincai').length, 1);
    assert.deepEqual(splitSpecialization('Ştiinţe ale Naturii, Limba engleză'), { profile: 'Științe ale Naturii', language: 'Limba engleză' });
});
test('reordering is immutable and respects boundaries', () => {
    const values = [1, 2, 3];
    assert.deepEqual(moveItem(values, 1, -1), [2, 1, 3]);
    assert.deepEqual(moveItem(values, 0, -1), values);
    assert.deepEqual(moveItem(values, 2, 1), values);
    assert.deepEqual(values, [1, 2, 3]);
});
test('unsafe links are rejected and missing codes remain missing in exports', () => {
    assert.equal(safeUrl('javascript:alert(1)'), null);
    assert.equal(safeUrl('https://example.com'), 'https://example.com/');
    assert.match(exportList([options[0]]), /Indisponibil/);
    assert.ok(exportList([{ ...options[0], code: '001', codeYear: 2026 }]).includes('\t001\t2026'));
});


test('explicit name sorting is independent of filter preference order', () => {
    const filtered = rankOptions(options, ['Uman', 'Real'], []);
    assert.deepEqual(sortResults(filtered, 'preferences', null), filtered);
    assert.deepEqual(sortResults(filtered, 'name', null).map(o => o.schoolName), ['A', 'A', 'B', 'Z']);
});
test('rank comparison sorts by distance and keeps unknown benchmarks last', () => {
    const rows = [{ ...options[0], lastRank: null }, { ...options[1], lastRank: 300 }, { ...options[2], lastRank: 110 }];
    assert.deepEqual(sortResults(rows, 'rank', 100).map(o => o.id), [3, 2, 1]);
    assert.equal(rows[0].lastRank, null);
});
