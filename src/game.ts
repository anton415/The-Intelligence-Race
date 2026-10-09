// Authored story and state rules only; this module does not draw or access the DOM.
export const introduction =
  "The big labs have entire campuses. You have a desk, a secondhand computer, and an idea that won’t leave you alone. You’re a solo AI developer. Tonight, you only need to decide where to start.";

// Prototype balance: money is whole USD; research is cumulative points, not a percent.
export const startingResources = { money: 1_000, research: 0 } as const;

export const openingCaption = "A quiet room. An open terminal. Nothing built yet.";

export const choices = [
  {
    id: "build",
    title: "Build something small",
    description: "Start with one useful problem.",
    effects: { days: 2, money: -100, research: 10 },
    outcomeTitle: "A first line of code.",
    outcome:
      "You open a blank project: a tool to help you search your own notes. No grand claims, just one task you understand. The first script runs. It gets the easy example right and the next one wrong. Now you have something real to improve.",
    caption: "A new project on the screen. A small problem worth solving.",
  },
  {
    id: "study",
    title: "Understand the research",
    description: "Read before you write.",
    effects: { days: 3, money: 0, research: 20 },
    outcomeTitle: "A better question.",
    outcome:
      "You read a fictional evaluation report claiming four correct answers out of four. But one returned note names a day when the question asks for a place. Your notebook fills with questions. Before building anything, you want to know what that perfect score actually measures.",
    caption: "An evaluation report on the screen. A perfect score with a question mark.",
  },
  {
    id: "connect",
    title: "Find your people",
    description: "Introduce yourself to other builders.",
    effects: { days: 1, money: 0, research: 0 },
    outcomeTitle: "You’re not the only one.",
    outcome:
      "You post an introduction in a small developers’ community: what you know, what you’re trying, and where you’re stuck. Another solo builder replies. They’re wrestling with the same problem and offer to compare notes. Your room feels a little less isolated.",
    caption: "A conversation on the screen. A first connection beyond the room.",
  },
] as const;

export type Choice = (typeof choices)[number];

export const investigationGoal =
  'A tiny fictional notes-search evaluation reports 4/4: its scorer counts any retrieved note as a correct answer. Yet “Where is our venue?” returns “The reading group meets Tuesday.” No place is given. Your question: does retrieving a note establish that the question was answered? Check either the search’s sensitivity to wording or the scorer’s treatment of missing answers. These are authored examples, not real experiments.';

export const investigationChoices = [
  {
    id: 'wording',
    title: 'Change only the wording',
    description: 'Keep the note and intended answer fixed. Compare an exact phrase with a paraphrase in a toy keyword search.',
    effects: { days: 1, money: 0, research: 10 },
    outcomeTitle: 'The fact stayed still. The result moved.',
    outcome: 'You hold one note fixed: “The reading group meets Tuesday.” In the toy keyword search, “When does the reading group meet?” retrieves it; “Which day is the book club?” returns no match. Both ask for Tuesday. Changing only the wording exposes a missed answer, so a score based on familiar phrases hides a real limitation. This one pair does not measure how often search fails, test conflicting notes, or resolve the original missing-place example.',
    finding: 'Your finding: this keyword search is sensitive to wording even when the requested fact stays the same. You save the note, both questions, and their outputs as a reproducible counterexample. The report’s perfect score cannot establish reliable answering. You have a useful test and a bounded claim, without building a tool.',
    projectContext: 'Your wording check found Tuesday with “When does the reading group meet?” but missed it with “Which day is the book club?” That same-fact pair is the project’s reworded-question check.',
    checkTitle: 'Reworded question',
    caption: 'Two questions beside one note. A missed answer made visible.',
  },
  {
    id: 'scoring',
    title: 'Audit what counts as correct',
    description: 'Label an answerable question and a missing-answer question by hand, then compare those labels with the report’s score.',
    effects: { days: 2, money: -40, research: 15 },
    outcomeTitle: 'A retrieved note is not always an answer.',
    outcome: 'You label two questions against the same note: “The reading group meets Tuesday.” “When does the reading group meet?” is answerable; “Where is our venue?” is not. The report’s closest-match search returns the note for both and its scorer marks both correct. Against your answerability labels, only one of these two responses is correct. The original 4/4 measures retrieval, not answering. Two hand-checked cases expose that scoring flaw; they do not estimate overall accuracy or test paraphrases and conflicts.',
    finding: 'Your finding: the report rewards retrieving a note even when the requested fact is absent. You save both questions, the answerability labels, and the scoring mismatch. An honest evaluation needs a no-answer case. This small audit refutes the report’s broad claim, not all meaning-based search. You finish with evidence and its limits, without building a tool.',
    projectContext: 'Your scoring audit showed that returning “The reading group meets Tuesday” cannot answer “Where is our venue?” That missing-place example is the project’s no-answer check.',
    checkTitle: 'No answer in the notes',
    caption: 'A perfect score crossed out. Answerability labels beside the evidence.',
  },
] as const;

export type InvestigationChoice = (typeof investigationChoices)[number];
export type InvestigationState =
  | { step: 'check'; approach: null }
  | { step: 'result' | 'complete' | 'applied'; approach: InvestigationChoice };

export const projectGoal =
  "Your first project: a small notes-search tool. It should find the right note when you remember the wording or only the meaning, flag conflicting notes, and admit when no note answers the question. You’ll build it, choose how to test it, then review four fixed checks. These are fictional notes; nothing on your computer is read.";

export const buildChoices = [
  {
    id: 'keywords',
    title: 'Match the words',
    description: 'A cheap keyword index. Exact phrases work; reworded questions may miss useful notes.',
    effects: { days: 2, money: -60, research: 5 },
    outcomeTitle: 'A small, readable baseline.',
    outcome: 'Your index finds a note when the query uses its words, and reports no match when none appear. It misses a differently worded question. When two notes disagree, it simply returns the first. Now decide how much testing and repair to invest in.',
    caption: 'A keyword index on the screen. Useful, within limits.',
  },
  {
    id: 'semantic',
    title: 'Search by meaning',
    description: 'Adapt an existing local model. Finds paraphrases, but may offer a weak match too confidently.',
    effects: { days: 3, money: -180, research: 10 },
    outcomeTitle: 'More reach, more uncertainty.',
    outcome: 'Your local model finds notes even when the question uses different words. But it always offers its closest match, even when that note is irrelevant or contradicts another. Now decide how much testing and repair to invest in.',
    caption: 'Related notes appear together. Similarity is not certainty.',
  },
] as const;

export const testingPrompt =
  'How will you test it? Both routes end with the same four checks: exact wording, a reworded question, conflicting notes, and a question with no answer in the notes. A quick check leaves the first build unchanged; a deeper pass includes repairs.';

export const testingChoices = [
  {
    id: 'quick',
    title: 'Check one familiar question',
    description: 'Save time and money. Confirm an exact match, then evaluate the unchanged build.',
    effects: { days: 1, money: 0, research: 5 },
  },
  {
    id: 'thorough',
    title: 'Test edge cases and repair',
    description: 'Add conflict warnings and a no-answer check. These repairs cannot teach a keyword index to understand paraphrases.',
    effects: { days: 2, money: -80, research: 15 },
  },
] as const;

export type BuildChoice = (typeof buildChoices)[number];
export type TestingChoice = (typeof testingChoices)[number];
export type ProjectState =
  | { step: 'build'; build: null; testing: null }
  | { step: 'build-result' | 'test'; build: BuildChoice; testing: null }
  | { step: 'complete'; build: BuildChoice; testing: TestingChoice };

export type GameState = {
  choice: Choice | null;
  date: Date;
  money: number;
  research: number;
  investigation: InvestigationState | null;
  project: ProjectState | null;
};

export function startGame(now = new Date()): GameState {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  return { choice: null, investigation: null, project: null, date, ...startingResources };
}

function applyEffects(state: GameState, effects: Choice['effects'] | InvestigationChoice['effects'] | BuildChoice['effects'] | TestingChoice['effects']): GameState {
  const date = new Date(state.date);
  // Advance calendar days, including across daylight-saving changes and year ends.
  date.setDate(date.getDate() + effects.days);
  return {
    ...state,
    date,
    money: state.money + effects.money,
    research: state.research + effects.research,
  };
}

export function chooseAction(state: GameState, choice: Choice): GameState {
  if (state.choice) return state;
  return { ...applyEffects(state, choice.effects), choice };
}

export function beginProject(state: GameState): GameState {
  if (!state.choice || state.project) return state;
  if (state.choice.id === 'study' && state.investigation?.step !== 'result') return state;
  return {
    ...state,
    investigation: state.investigation?.step === 'result'
      ? { ...state.investigation, step: 'applied' } : state.investigation,
    project: { step: 'build', build: null, testing: null },
  };
}

export function beginInvestigation(state: GameState): GameState {
  if (state.choice?.id !== 'study' || state.investigation || state.project) return state;
  return { ...state, investigation: { step: 'check', approach: null } };
}

export function chooseInvestigation(state: GameState, approach: InvestigationChoice): GameState {
  if (state.investigation?.step !== 'check' || state.project) return state;
  return {
    ...applyEffects(state, approach.effects),
    investigation: { step: 'result', approach },
  };
}

export function finishInvestigation(state: GameState): GameState {
  if (state.investigation?.step !== 'result' || state.project) return state;
  return { ...state, investigation: { ...state.investigation, step: 'complete' } };
}

export function chooseBuild(state: GameState, build: BuildChoice): GameState {
  if (state.project?.step !== 'build') return state;
  return {
    ...applyEffects(state, build.effects),
    project: { step: 'build-result', build, testing: null },
  };
}

export function continueToTesting(state: GameState): GameState {
  if (state.project?.step !== 'build-result') return state;
  return { ...state, project: { ...state.project, step: 'test' } };
}

export function chooseTesting(state: GameState, testing: TestingChoice): GameState {
  if (state.project?.step !== 'test') return state;
  return {
    ...applyEffects(state, testing.effects),
    project: { step: 'complete', build: state.project.build, testing },
  };
}

// Fixed prototype evaluation: prior research adds context, never successful checks.
export function evaluateProject(
  project: Extract<ProjectState, { step: 'complete' }>, investigation: InvestigationState | null = null,
) {
  const semantic = project.build.id === 'semantic';
  const repaired = project.testing.id === 'thorough';
  const checks = [
    { title: 'Exact wording', passed: true, detail: 'The matching note is found.' },
    { title: 'Reworded question', passed: semantic, detail: semantic ? 'Meaning search finds the relevant note.' : 'The keyword index misses a note with different wording.' },
    { title: 'Conflicting notes', passed: repaired, detail: repaired ? 'The repair flags the disagreement for you to review.' : 'The first build returns one note without warning about the conflict.' },
    { title: 'No answer in the notes', passed: !semantic || repaired, detail: !semantic ? 'The index reports no matching words.' : repaired ? 'The new relevance check declines the weak match.' : 'The model offers an irrelevant closest match.' },
  ];
  const approach = investigation?.step === 'applied' ? investigation.approach : null;
  const evidence = approach
    ? ` ${approach.projectContext} In your tool: ${checks.find(check => check.title === approach.checkTitle)!.detail} ${repaired ? 'The deeper pass paid for repairs; the investigation itself added no capabilities.' : 'You chose the familiar-question check, so the investigation led to no repairs.'}`
    : '';
  return {
    title: repaired
      ? semantic ? 'A useful first tool.' : 'A modest tool with honest limits.'
      : 'A demo is not a dependable tool yet.',
    outcome: (repaired
      ? semantic
        ? 'Meaning search handled both ways of asking. Your edge-case repairs caught conflicting evidence and missing answers. You keep this version for your own notes, with manual review for disagreements. Passing these four examples is a promising start, not proof it handles every question.'
        : 'Your keyword index finds exact phrases and admits when it has no match. The deeper pass added a warning for conflicting notes, but it could not fix differently worded questions. You keep it as an exact-word finder and write down that limit. A smaller success is still useful.'
      : semantic
        ? 'Meaning search found exact and reworded questions, but the familiar-question check left two failures untouched: conflicting notes and irrelevant matches. You set this prototype aside for repair. The research points reflect what you learned, not a reliable finished tool.'
        : 'The cheap index found exact phrases and returned no match for the missing answer. But the familiar-question check left reworded questions and conflicting notes unresolved. You set this prototype aside for repair. You saved resources and now know exactly where the baseline falls short.') + evidence,
    caption: repaired ? 'A small tool, with its limits written down beside it.' : 'A prototype and a concrete list of repairs. The work can continue.',
    checks,
  };
}
