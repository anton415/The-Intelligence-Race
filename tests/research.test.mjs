import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  choices, chooseAction, startGame, investigationChoices, beginInvestigation,
  chooseInvestigation, finishInvestigation, beginProject, buildChoices,
  chooseBuild, continueToTesting, testingChoices, chooseTesting, evaluateProject,
} from '../.test-build/game.js';

const now = new Date(2026, 11, 30, 23, 30);
const study = choices.find(choice => choice.id === 'study');
const resources = ({ date, money, research }) => ({ date, money, research });
const investigate = approach => chooseInvestigation(
  beginInvestigation(chooseAction(startGame(now), study)), approach,
);

function assertEffects(before, after, { days, money, research }) {
  const date = new Date(before.date);
  date.setDate(date.getDate() + days);
  assert.deepEqual(resources(after), {
    date, money: before.money + money, research: before.research + research,
  });
  assert.equal(after.choice, before.choice);
}

test('investigation costs match the documented prototype values', () => {
  assert.deepEqual(investigationChoices.map(({ id, effects }) => ({ id, ...effects })), [
    { id: 'wording', days: 1, money: 0, research: 10 },
    { id: 'scoring', days: 2, money: -40, research: 15 },
  ]);
});

test('research must investigate before building; other openings retain their project routes', () => {
  for (const choice of choices) {
    const opened = chooseAction(startGame(now), choice);
    if (choice.id === 'study') {
      assert.equal(beginProject(opened), opened);
      const checking = beginInvestigation(opened);
      assertEffects(opened, checking, { days: 0, money: 0, research: 0 });
      assert.equal(checking.project, null);
      assert.equal(checking.investigation.step, 'check');
      assert.equal(checking.investigation.approach, null);
      assert.equal(beginProject(checking), checking);
      assert.equal(finishInvestigation(checking), checking);
    } else {
      assert.equal(beginInvestigation(opened), opened);
      assert.equal(beginProject(opened).project.step, 'build');
    }
  }
});

for (const approach of investigationChoices) {
  test(`${approach.id}: check once, retain distinct evidence and limits, finish without a tool`, () => {
    const checking = beginInvestigation(chooseAction(startGame(now), study));
    const snapshot = structuredClone(checking);
    const result = chooseInvestigation(checking, approach);
    assert.deepEqual(checking, snapshot);
    assertEffects(checking, result, approach.effects);
    assert.equal(result.investigation.approach, approach);
    assert.equal(result.investigation.step, 'result');
    assert.deepEqual(investigate(approach), result);
    assert.match(approach.outcome, /Tuesday/);
    assert.match(approach.outcome, approach.id === 'wording'
      ? /does not measure how often search fails/ : /do not estimate overall accuracy/);
    const complete = finishInvestigation(result);
    assertEffects(result, complete, { days: 0, money: 0, research: 0 });
    assert.equal(complete.project, null);
    assert.equal(complete.investigation.step, 'complete');
    assert.equal(complete.investigation.approach, approach);
    assert.match(approach.finding, /without building a tool/);
    assert.equal(beginProject(complete), complete);
    assert.equal(finishInvestigation(complete), complete);
  });

  for (const build of buildChoices) {
    for (const testing of testingChoices) {
      test(`${approach.id}/${build.id}/${testing.id}: preserve research, pay once, finish with unchanged checks and visible evidence`, () => {
        const result = investigate(approach);
        const building = beginProject(result);
        assertEffects(result, building, { days: 0, money: 0, research: 0 });
        assert.equal(building.project.step, 'build');
        assert.equal(building.project.build, null);
        assert.equal(building.investigation.step, 'applied');
        assert.equal(building.investigation.approach, approach);
        assert.equal(result.investigation.step, 'result');
        const built = chooseBuild(building, build);
        assertEffects(building, built, build.effects);
        const ready = continueToTesting(built);
        assertEffects(built, ready, { days: 0, money: 0, research: 0 });
        const complete = chooseTesting(ready, testing);
        assertEffects(ready, complete, testing.effects);
        assert.equal(complete.project.step, 'complete');
        for (const state of [building, built, ready, complete]) {
          assert.equal(state.investigation, building.investigation);
          assert.equal(state.choice, study);
          assert.ok(state.money >= 0);
          assert.ok(state.research >= 0);
          assert.equal(finishInvestigation(state), state);
        }
        const snapshot = structuredClone(complete);
        const evaluation = evaluateProject(complete.project, complete.investigation);
        const baseline = evaluateProject(complete.project);
        assert.deepEqual(evaluation.checks, baseline.checks);
        assert.equal(evaluation.title, baseline.title);
        assert.ok(evaluation.outcome.includes(approach.projectContext));
        assert.ok(evaluation.outcome.includes(
          baseline.checks.find(check => check.title === approach.checkTitle).detail,
        ));
        assert.match(evaluation.outcome, testing.id === 'quick'
          ? /investigation led to no repairs/ : /investigation itself added no capabilities/);
        assert.deepEqual(evaluateProject(complete.project, complete.investigation), evaluation);
        assert.deepEqual(complete, snapshot);
        const replay = chooseTesting(continueToTesting(chooseBuild(
          beginProject(investigate(approach)), build,
        )), testing);
        assert.deepEqual(replay, complete);
      });
    }
  }
}

test('repeated or out-of-order actions cannot skip a choice, reopen an ending or charge twice', () => {
  const initial = startGame(now);
  const opened = chooseAction(initial, study);
  const checking = beginInvestigation(opened);
  const states = [initial, opened, checking];
  for (const approach of investigationChoices) {
    const result = chooseInvestigation(checking, approach);
    states.push(result, finishInvestigation(result));
    const building = beginProject(result);
    states.push(building);
    for (const build of buildChoices) {
      const built = chooseBuild(building, build);
      const ready = continueToTesting(built);
      states.push(built, ready, ...testingChoices.map(testing => chooseTesting(ready, testing)));
    }
  }
  const transitions = [
    ...choices.map(choice => [state => !state.choice, state => chooseAction(state, choice)]),
    [state => state === opened, beginInvestigation],
    ...investigationChoices.map(approach => [
      state => state.investigation?.step === 'check', state => chooseInvestigation(state, approach),
    ]),
    [state => state.investigation?.step === 'result', finishInvestigation],
    [state => state.investigation?.step === 'result', beginProject],
    ...buildChoices.map(build => [state => state.project?.step === 'build', state => chooseBuild(state, build)]),
    [state => state.project?.step === 'build-result', continueToTesting],
    ...testingChoices.map(testing => [state => state.project?.step === 'test', state => chooseTesting(state, testing)]),
  ];
  for (const state of states) {
    const snapshot = structuredClone(state);
    for (const [allowed, transition] of transitions) {
      if (!allowed(state)) assert.equal(transition(state), state);
    }
    assert.deepEqual(state, snapshot);
    const restarted = startGame(new Date(2027, 0, 12, 23, 59));
    assert.deepEqual(restarted, {
      choice: null, investigation: null, project: null,
      date: new Date(2027, 0, 12), money: 1000, research: 0,
    });
    assert.equal(beginInvestigation(restarted), restarted);
    assert.equal(beginProject(restarted), restarted);
  }
});
