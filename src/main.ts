import './style.css';
import { choices, chooseAction, introduction, openingCaption, startGame } from './game';

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
let state = startGame();

element('introduction').textContent = introduction;

for (const [index, choice] of choices.entries()) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'choice';

  const number = document.createElement('span');
  number.className = 'choice-number';
  number.textContent = `0${index + 1}`;
  number.setAttribute('aria-hidden', 'true');

  const copy = document.createElement('span');
  const title = document.createElement('strong');
  title.textContent = choice.title;
  const description = document.createElement('span');
  description.textContent = choice.description;
  copy.append(title, description);
  button.append(number, copy);
  button.addEventListener('click', () => {
    state = chooseAction(state, choice);
    render();
    outcomeTitle.focus();
  });
  choiceList.append(button);
}

function render() {
  const choice = state.choice;
  choiceList.hidden = choice !== null;
  prompt.hidden = choice !== null;
  outcome.hidden = choice === null;
  element('chosen-action').textContent = choice?.title ?? '';
  outcomeTitle.textContent = choice?.outcomeTitle ?? '';
  element('outcome-text').textContent = choice?.outcome ?? '';
  caption.textContent = choice?.caption ?? openingCaption;
  element('progress').textContent = choice ? 'Opening complete' : 'Choose your first step';
}

element<HTMLButtonElement>('restart').addEventListener('click', () => {
  state = startGame();
  render();
  choiceList.querySelector('button')?.focus();
});

render();
