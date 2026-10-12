import assert from 'node:assert/strict';
import test from 'node:test';
import { getExtraText, updateExtraTexts } from './tour-extras';

test('legacy plain text is German only', () => {
  const row = { name: 'Delfinschwimmen', description: 'Fünf Minuten pro Person' };
  assert.deepEqual(getExtraText(row, 'de'), { name: 'Delfinschwimmen', description: 'Fünf Minuten pro Person' });
  assert.equal(getExtraText(row, 'en'), null);
  assert.equal(getExtraText(row, 'ar'), null);
});

test('editing one locale preserves every other locale', () => {
  const row = { name: 'Delfinschwimmen', description: 'Fünf Minuten pro Person' };
  const translated = updateExtraTexts(row, 'en', { name: 'Swim with dolphins', description: 'Five minutes per person' });
  const afterEnglish = { ...row, description: translated };
  assert.deepEqual(getExtraText(afterEnglish, 'de'), { name: 'Delfinschwimmen', description: 'Fünf Minuten pro Person' });
  assert.deepEqual(getExtraText(afterEnglish, 'en'), { name: 'Swim with dolphins', description: 'Five minutes per person' });
  assert.equal(getExtraText(afterEnglish, 'fr'), null);

  const updatedGerman = updateExtraTexts(afterEnglish, 'de', { name: 'Neuer Name', description: 'Neue Beschreibung' });
  assert.deepEqual(getExtraText({ name: 'Neuer Name', description: updatedGerman }, 'en'), {
    name: 'Swim with dolphins', description: 'Five minutes per person',
  });
});

test('German extra name always comes from the base row', () => {
  const row = {
    name: 'Aktueller deutscher Name',
    description: JSON.stringify({ de: { name: 'Alter Name', description: 'Beschreibung' } }),
  };
  assert.deepEqual(getExtraText(row, 'de'), {
    name: 'Aktueller deutscher Name', description: 'Beschreibung',
  });
});
