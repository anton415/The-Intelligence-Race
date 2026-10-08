import assert from 'node:assert/strict';
import { test } from 'node:test';
import { choices, chooseAction, startGame } from '../.test-build/game.js';

function calendarDate(date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
}

test('a new game starts with the local calendar date and prototype resources', () => {
  const now = new Date(2026, 9, 8, 23, 45);
  const state = startGame(now);
  assert.deepEqual(calendarDate(state.date), [2026, 10, 8]);
  assert.equal(state.date.getHours(), 0);
  assert.equal(now.getHours(), 23);
  assert.equal(state.money, 1_000);
  assert.equal(state.research, 0);
  assert.equal(state.choice, null);
  assert.deepEqual(calendarDate(startGame().date), calendarDate(new Date()));
});

test('new games use the local date on both sides of a UTC day boundary', () => {
  const originalTimezone = process.env.TZ;
  try {
    for (const [timezone, instant, expected] of [
      ['America/Los_Angeles', '2026-01-01T00:30:00Z', [2025, 12, 31]],
      ['Asia/Tokyo', '2026-12-31T23:30:00Z', [2027, 1, 1]],
    ]) {
      process.env.TZ = timezone;
      assert.deepEqual(calendarDate(startGame(new Date(instant)).date), expected);
    }
  } finally {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
  }
});

test('exactly three authored choices have the documented effects', () => {
  assert.deepEqual(choices.map(({ id, effects }) => ({ id, ...effects })), [
    { id: 'build', days: 2, money: -100, research: 10 },
    { id: 'study', days: 3, money: 0, research: 20 },
    { id: 'connect', days: 1, money: 0, research: 0 },
  ]);
});

for (const choice of choices) {
  test(`${choice.id} applies exactly its advertised effects and keeps its outcome`, () => {
    const initial = startGame(new Date(2026, 9, 8));
    const result = chooseAction(initial, choice);
    assert.deepEqual(calendarDate(result.date), [2026, 10, 8 + choice.effects.days]);
    assert.equal(result.money - initial.money, choice.effects.money);
    assert.equal(result.research - initial.research, choice.effects.research);
    assert.equal(result.choice, choice);
    assert.deepEqual(initial, startGame(new Date(2026, 9, 8)));

    for (const repeatedChoice of choices) {
      assert.equal(chooseAction(result, repeatedChoice), result);
    }
  });
}

test('calendar days advance across month, leap-day, and year boundaries', () => {
  for (const [start, expected] of [
    [[2026, 1, 31], [2026, 2, 2]],
    [[2026, 2, 28], [2026, 3, 2]],
    [[2028, 2, 28], [2028, 3, 1]],
    [[2026, 12, 31], [2027, 1, 2]],
  ]) {
    const [year, month, day] = start;
    const state = startGame(new Date(year, month - 1, day));
    assert.deepEqual(calendarDate(chooseAction(state, choices[0]).date), expected);
  }
});

test('calendar days advance across both daylight-saving changes', () => {
  const originalTimezone = process.env.TZ;
  try {
    process.env.TZ = 'America/New_York';
    for (const [month, day, expectedDay] of [[3, 7, 9], [10, 31, 2]]) {
      const state = startGame(new Date(2026, month - 1, day));
      const result = chooseAction(state, choices[0]);
      assert.deepEqual(calendarDate(result.date), [2026, month === 3 ? 3 : 11, expectedDay]);
      assert.equal(result.date.getHours(), 0);
    }
  } finally {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
  }
});

test('restart restores resources, uses a fresh date, and allows deterministic replay', () => {
  const now = new Date(2026, 9, 8);
  for (const choice of choices) {
    const result = chooseAction(startGame(now), choice);
    const restarted = startGame(now);
    assert.equal(restarted.choice, null);
    assert.equal(restarted.money, 1_000);
    assert.equal(restarted.research, 0);
    assert.deepEqual(calendarDate(restarted.date), [2026, 10, 8]);
    assert.deepEqual(chooseAction(restarted, choice), result);
  }
  const nextDay = startGame(new Date(2026, 9, 9));
  assert.deepEqual(calendarDate(nextDay.date), [2026, 10, 9]);
  assert.equal(nextDay.choice, null);
  assert.equal(nextDay.money, 1_000);
  assert.equal(nextDay.research, 0);
});
