// Authored story and decisions only; this module does not draw or access the DOM.
export const introduction =
  "It’s 2026. The big labs have entire campuses. You have a desk, a secondhand computer, and an idea that won’t leave you alone. You’re a solo AI developer. Tonight, you only need to decide where to start.";

export const openingCaption = "A quiet room. An open terminal. Nothing built yet.";

export const choices = [
  {
    id: "build",
    title: "Build something small",
    description: "Start with one useful problem.",
    outcomeTitle: "A first line of code.",
    outcome:
      "You open a blank project: a tool to help you search your own notes. No grand claims, just one task you understand. The first script runs. It gets the easy example right and the next one wrong. Now you have something real to improve.",
    caption: "A new project on the screen. A small problem worth solving.",
  },
  {
    id: "study",
    title: "Understand the research",
    description: "Read before you write.",
    outcomeTitle: "A better question.",
    outcome:
      "You pull up a paper on evaluating AI agents and work through its examples. One result depends on a detail buried in the setup. Your notebook fills with questions. You haven’t built a model tonight, but you know what you want to test first.",
    caption: "A paper on the screen. The notebook is no longer empty.",
  },
  {
    id: "connect",
    title: "Find your people",
    description: "Introduce yourself to other builders.",
    outcomeTitle: "You’re not the only one.",
    outcome:
      "You post an introduction in a small developers’ community: what you know, what you’re trying, and where you’re stuck. Another solo builder replies. They’re wrestling with the same problem and offer to compare notes. Your room feels a little less isolated.",
    caption: "A conversation on the screen. A first connection beyond the room.",
  },
] as const;

export type Choice = (typeof choices)[number];
export type GameState = { choice: Choice | null };

export function startGame(): GameState {
  return { choice: null };
}

export function chooseAction(state: GameState, choice: Choice): GameState {
  return state.choice ? state : { choice };
}
