import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  choices, chooseAction, startGame, buildChoices, testingChoices,
  beginProject, chooseBuild, continueToTesting, chooseTesting, evaluateProject,
} from '../.test-build/game.js';

const now = new Date(2026, 11, 30, 23, 30);
const resources = ({ date, money, research }) => ({ date, money, research });
const projectOpenings = choices.filter(choice => choice.id !== 'study');

function assertEffects(before, after, { days, money, research }) {
  const date = new Date(before.date);
  date.setDate(date.getDate() + days);
  assert.deepEqual(resources(after), {
    date, money: before.money + money, research: before.research + research,
  });
  assert.equal(after.choice, before.choice);
}

function play(opening, build, testing) {
  return chooseTesting(continueToTesting(chooseBuild(
    beginProject(chooseAction(startGame(now), opening)), build,
  )), testing);
}

test('project costs match the documented prototype values', () => {
  assert.deepEqual(buildChoices.map(({ id, effects }) => ({ id, ...effects })), [
    { id: 'keywords', days: 2, money: -60, research: 5 },
    { id: 'semantic', days: 3, money: -180, research: 10 },
  ]);
  assert.deepEqual(testingChoices.map(({ id, effects }) => ({ id, ...effects })), [
    { id: 'quick', days: 1, money: 0, research: 5 },
    { id: 'thorough', days: 2, money: -80, research: 15 },
  ]);
});

test('project actions cannot run before the opening or skip a decision', () => {
  const initial = startGame(now);
  const opening = chooseAction(initial, choices[0]);
  const building = beginProject(opening);
  const built = chooseBuild(building, buildChoices[0]);
  for (const state of [initial, opening]) {
    assert.equal(chooseBuild(state, buildChoices[0]), state);
  }
  for (const state of [initial, opening, building, built]) {
    assert.equal(chooseTesting(state, testingChoices[0]), state);
  }
  for (const state of [initial, opening, building]) {
    assert.equal(continueToTesting(state), state);
  }
  assert.equal(beginProject(initial), initial);
});

for (const opening of projectOpenings) {
  test(`${opening.id}: entering the project preserves the opening decision, date and resources`, () => {
    const before = chooseAction(startGame(now), opening);
    const after = beginProject(before);
    assert.deepEqual(resources(after), resources(before));
    assert.equal(after.choice, opening);
    assert.equal(after.project.step, 'build');
    assert.equal(before.project, null);
    assert.equal(beginProject(after), after);
  });

  for (const build of buildChoices) {
    for (const testing of testingChoices) {
      test(`${opening.id}/${build.id}/${testing.id}: costs once, finishable, deterministic, restart at every step`, () => {
        const initial = startGame(now);
        const opened = chooseAction(initial, opening);
        const building = beginProject(opened);
        const built = chooseBuild(building, build);
        assertEffects(building, built, build.effects);
        assert.equal(building.project.build, null);
        const testingState = continueToTesting(built);
        assert.deepEqual(resources(testingState), resources(built));
        const complete = chooseTesting(testingState, testing);
        assertEffects(testingState, complete, testing.effects);
        assert.equal(testingState.project.testing, null);
        assert.equal(complete.project.step, 'complete');
        assert.equal(complete.project.build, build);
        assert.equal(complete.project.testing, testing);

        for (const state of [built, testingState, complete]) {
          for (const repeatedBuild of buildChoices) {
            assert.equal(chooseBuild(state, repeatedBuild), state);
          }
        }
        for (const repeatedTesting of testingChoices) {
          assert.equal(chooseTesting(complete, repeatedTesting), complete);
        }
        for (const state of [testingState, complete]) {
          assert.equal(continueToTesting(state), state);
        }
        const snapshot = structuredClone(complete);
        assert.deepEqual(evaluateProject(complete.project), evaluateProject(complete.project));
        assert.deepEqual(complete, snapshot); // Reading the evaluation has no effects.
        assert.deepEqual(play(opening, build, testing), complete);

        for (const state of [opened, building, built, testingState, complete]) {
          assert.ok(state.money >= 0);
          assert.ok(state.research >= 0);
          for (const repeatedOpening of choices) {
            assert.equal(chooseAction(state, repeatedOpening), state);
          }
          if (state.project) assert.equal(beginProject(state), state);
          const restarted = startGame(new Date(2027, 0, 12, 23, 59));
          assert.equal(restarted.choice, null);
          assert.equal(restarted.project, null);
          assert.equal(restarted.money, 1_000);
          assert.equal(restarted.research, 0);
          assert.deepEqual(restarted.date, new Date(2027, 0, 12));
        }
      });
    }
  }
}

test('the four fixed evaluations explain capabilities, limits and consequences', () => {
  const expected = {
    keywords: { quick: [true, false, false, true], thorough: [true, false, true, true] },
    semantic: { quick: [true, true, false, false], thorough: [true, true, true, true] },
  };
  const outcomes = new Set();
  for (const opening of projectOpenings) {
    for (const build of buildChoices) {
      for (const testing of testingChoices) {
        const result = evaluateProject(play(opening, build, testing).project);
        assert.deepEqual(result.checks.map(check => check.passed), expected[build.id][testing.id]);
        assert.deepEqual(result.checks.map(check => check.title), [
          'Exact wording', 'Reworded question', 'Conflicting notes', 'No answer in the notes',
        ]);
        assert.ok(result.checks.every(check => check.detail.length > 0));
        assert.match(result.outcome, testing.id === 'quick' ? /set this prototype aside for repair/ : /keep/);
        outcomes.add(result.outcome);
      }
    }
  }
  assert.equal(outcomes.size, 4);
});
