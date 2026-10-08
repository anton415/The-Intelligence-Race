import './style.css';
import {
  choices, chooseAction, introduction, openingCaption, startGame,
  projectGoal, buildChoices, testingPrompt, testingChoices,
  beginProject, chooseBuild, continueToTesting, chooseTesting, evaluateProject,
  type Choice, type BuildChoice, type TestingChoice, type GameState,
} from './game';

function element<T extends HTMLElement>(id: string): T {
  const target = document.getElementById(id);
  if (!target) throw new Error(`Missing game element: ${id}`);
  return target as T;
}

const choiceList = element('choices');
const prompt = element('choice-prompt');
const outcome = element('outcome');
const outcomeTitle = element('outcome-title');
const caption = element('scene-caption');
const continuation = element('continuation');
const evaluation = element('evaluation');
let state = startGame();

function formatMoney(value: number): string {
  return `$${value.toLocaleString('en-US')} USD`;
}

function formatDelta(value: number, unit: 'money' | 'research'): string {
  const amount = unit === 'money' ? formatMoney(Math.abs(value)) : `${Math.abs(value)} points`;
  if (value === 0) return `${amount} (unchanged)`;
  return `${value > 0 ? '+' : '−'}${amount}`;
}

function commit(previous: GameState, next: GameState, event: MouseEvent) {
  // A double-click can land on a new button after rendering; keyboard clicks have detail 0.
  if (event.detail > 1) return;
  // Detached buttons and queued activations belong to the screen that created them.
  if (state !== previous || next === previous) return;
  state = next;
  render();
  (outcome.hidden ? prompt : outcomeTitle).focus();
}

function showChoices<T extends Choice | BuildChoice | TestingChoice>(
  actions: readonly T[], transition: (state: GameState, action: T) => GameState,
) {
  const previous = state;
  choiceList.hidden = false;
  prompt.hidden = false;
  for (const [index, action] of actions.entries()) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';

    const number = document.createElement('span');
    number.className = 'choice-number';
    number.textContent = `0${index + 1}`;
    number.setAttribute('aria-hidden', 'true');

    const copy = document.createElement('span');
    const title = document.createElement('strong');
    title.textContent = action.title;
    const description = document.createElement('span');
    description.textContent = action.description;
    const effects = document.createElement('span');
    effects.className = 'choice-effects';
    const { days, money, research } = action.effects;
    effects.textContent = `${days} ${days === 1 ? 'day' : 'days'} · Money: ${formatDelta(money, 'money')} · Research: ${formatDelta(research, 'research')}`;
    copy.append(title, description, effects);
    button.append(number, copy);
    button.addEventListener('click', event => commit(previous, transition(previous, action), event));
    choiceList.append(button);
  }
}

function showOutcome(chosen: string, title: string, text: string, sceneCaption: string) {
  outcome.hidden = false;
  element('chosen-action').textContent = chosen;
  outcomeTitle.textContent = title;
  element('outcome-text').textContent = text;
  caption.textContent = sceneCaption;
}

function showContinue(title: string, transition: (state: GameState) => GameState) {
  const previous = state;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'choice';
  const copy = document.createElement('span');
  const label = document.createElement('strong');
  label.textContent = title;
  const description = document.createElement('span');
  description.textContent = 'Continue · No time or resource cost';
  copy.append(label, description);
  button.append(copy);
  button.addEventListener('click', event => commit(previous, transition(previous), event));
  continuation.append(button);
}

function render() {
  const { choice, project } = state;
  element('game-date').textContent = state.date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  element('money').textContent = formatMoney(state.money);
  element('research').textContent = `${state.research} points`;
  element('introduction').textContent = project ? projectGoal : introduction;
  element('story-label').textContent = project ? 'Project 01 / Search your notes' : 'Opening / A small beginning';
  element('opening-decision').hidden = !project;
  element('opening-decision').textContent = project ? `Your beginning: ${choice?.title}` : '';
  choiceList.replaceChildren();
  continuation.replaceChildren();
  evaluation.replaceChildren();
  evaluation.hidden = true;
  choiceList.hidden = true;
  prompt.hidden = true;
  outcome.hidden = true;
  element('end-note').hidden = true;
  caption.textContent = project?.build?.caption ?? choice?.caption ?? openingCaption;

  if (!choice) {
    prompt.textContent = 'Where will you begin?';
    element('progress').textContent = 'Choose your first step';
    showChoices(choices, chooseAction);
  } else if (!project) {
    showOutcome(choice.title, choice.outcomeTitle, choice.outcome, choice.caption);
    element('progress').textContent = 'Opening complete';
    showContinue('Start your notes-search project', beginProject);
  } else if (project.step === 'build') {
    prompt.textContent = '1 / Build — How will your tool find a note?';
    element('progress').textContent = 'Project · Build';
    showChoices(buildChoices, chooseBuild);
  } else if (project.step === 'build-result') {
    showOutcome(project.build.title, project.build.outcomeTitle, project.build.outcome, project.build.caption);
    element('progress').textContent = 'Build complete';
    showContinue('Plan your testing', continueToTesting);
  } else if (project.step === 'test') {
    prompt.textContent = `2 / Test — ${testingPrompt}`;
    element('progress').textContent = 'Project · Test and evaluate';
    showChoices(testingChoices, chooseTesting);
  } else if (project.step === 'complete') {
    const result = evaluateProject(project);
    showOutcome(`${project.build.title} → ${project.testing.title}`, result.title, result.outcome, result.caption);
    evaluation.hidden = false;
    for (const check of result.checks) {
      const item = document.createElement('li');
      const title = document.createElement('strong');
      title.textContent = `${check.passed ? 'Pass' : 'Fail'} · ${check.title}`;
      item.append(title, document.createTextNode(check.detail));
      evaluation.append(item);
    }
    element('progress').textContent = `Project complete · ${result.checks.filter(check => check.passed).length}/4 checks passed`;
    element('end-note').hidden = false;
  }
}

element<HTMLButtonElement>('restart').addEventListener('click', () => {
  state = startGame();
  render();
  choiceList.querySelector('button')?.focus();
});

render();
