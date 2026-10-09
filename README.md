# The Intelligence Race

A single-player, choice-driven game about developing AI, building organizations, and living with the consequences in a persistent alternate-history world.

## Play now

**[Play The Intelligence Race](https://anton415.github.io/The-Intelligence-Race/)**

The first release, **v0.1.0**, is the playable opening scene. The current source
extends it into a first notes-search project: choose → build → test → evaluate.
We will expand the game in small, playable updates.

The GitHub Pages site rebuilds and updates automatically whenever changes merge
into `main`. Versioned snapshots and release notes are available in
**[GitHub Releases](https://github.com/anton415/The-Intelligence-Race/releases)**.
The live site follows `main`, so it may include changes newer than the latest release.

## Play locally

Use Node.js 20.19+ (20.x), or 22.12+ and npm, as required by [Vite](https://vite.dev/guide/).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173/The-Intelligence-Race/).

```bash
npm run build    # Type-check and build into dist/
npm run preview  # Serve the production build locally
npm test         # Check opening/project transitions, evaluations, dates, and restart
```

The production preview uses the same `/The-Intelligence-Race/` path as GitHub Pages.

The opening has one pixel-style developer room with a blinking monitor, an
introduction, and exactly three choices. Each has a fixed, distinct outcome and
shows its duration and resource changes before selection, including unchanged resources.
The status panel displays the in-game date, money in USD, and research progress in points.
Every opening outcome offers a free continuation into the same notes-search project,
preserving the opening decision, date, money, and research.
**Restart** restores the introduction so you can try the other paths.
Use Tab/Shift+Tab to move between controls and Enter/Space to activate buttons.
The monitor animation respects your system's reduced-motion preference.

New games start on the player's **current local calendar date**, with **$1,000 USD**
and **0 research points**. These are simple prototype values, not an economic model;
research points are a cumulative score, not a percentage or a completed project.

| Opening choice | Time | Money change | Research change |
| --- | --- | --- | --- |
| Build something small | 2 days | −$100 USD | +10 points |
| Understand the research | 3 days | $0 USD (unchanged) | +20 points |
| Find your people | 1 day | $0 USD (unchanged) | 0 points (unchanged) |

### First project: search your notes

The goal is to find a relevant note using exact wording or a paraphrase, flag
conflicting notes, and admit when the notes contain no answer. After the opening,
choose a build approach, read its result, then choose a testing approach. The second
choice includes evaluation and ends the project. All notes, models, and results
are fictional and authored; no user files are read and no real AI is run.

| Project step | Choice | Time | Money change | Research change |
| --- | --- | --- | --- | --- |
| Build | Match the words | 2 days | −$60 USD | +5 points |
| Build | Search by meaning | 3 days | −$180 USD | +10 points |
| Test | Check one familiar question | 1 day | $0 USD (unchanged) | +5 points |
| Test | Test edge cases and repair | 2 days | −$80 USD | +15 points |

These are prototype costs, not estimates of real AI development. The most expensive
complete path spends $360 including the opening, leaving $640; all 12 combinations
of opening, build, and test can finish. Research remains a cumulative score and
does not secretly alter the evaluation.

Evaluation always uses four fixed checks. The quick test confirms an exact match
without repairs. The deeper test adds conflict warnings and rejection of weak
matches; it does not add meaning search to a keyword index.

| Build + test | Exact wording | Reworded question | Conflicting notes | No answer in notes | Consequence |
| --- | --- | --- | --- | --- | --- |
| Words + familiar question | Pass | Fail | Fail | Pass | Set aside for repair (2/4) |
| Meaning + familiar question | Pass | Pass | Fail | Fail | Set aside for repair (2/4) |
| Words + edge cases | Pass | Fail | Pass | Pass | Keep as an exact-word finder (3/4) |
| Meaning + edge cases | Pass | Pass | Pass | Pass | Keep for personal use with review (4/4) |

Each ending explains the checks and how the decisions contributed. Passing four
examples does not establish general reliability. The same decisions always produce
the same result; the opening affects resources and remains recorded, but introduces
no hidden quality bonus. Setbacks end with a repair plan, not a dead end or Game Over.

Each committed choice applies its effects **once**. Reading build results and using
the two continuation buttons cost no time or resources. Time advances in calendar
days, including across month/year boundaries and daylight-saving changes. Waiting,
inspecting, or leaving the game does not advance time or resources. Restart at any
step clears both opening and project decisions, uses the current local date and
starting resources, restores all three opening choices, and focuses the first one.
There is no saving yet: reloading also starts a new game.

The game runs entirely in the browser. It uses local CSS artwork and prewritten
text: no API calls, sign-in, backend, or remote assets. The community conversation
is fictional; choosing it does not send a real message. Installing dependencies
requires internet access; playing through the local server does not.

Story data and decision state live in `src/game.ts`; `src/main.ts` presents them,
and `src/style.css` draws the room. Starting resources, choice effects, and transition
rules and fixed evaluation checks are all in `src/game.ts`. This is the opening plus
one project loop, not the full 10–15 minute v0.1 described below. Saving, further
projects, rival events, hiring, and company simulation are not implemented.

To check the slice manually, use `npm run build` and `npm run preview`, then open
`/The-Intelligence-Race/`. Try each opening through a project conclusion, and all
four build/test combinations. Confirm advertised costs, free continuation, distinct
evaluation explanations, and deterministic replay. Try repeated activation and
waiting; neither should duplicate costs or skip a decision. Restart from the build,
build result, testing step, and conclusion; check resources, date, and first-choice
focus. Repeat with Tab/Shift+Tab and Enter/Space, a narrow viewport, and reduced
motion enabled. The project loop requires user playtest acceptance before merge.

## The premise

Start a new game on the real-world date you begin playing. You are a solo AI developer with limited resources. Build useful AI, compete and collaborate with other organizations, hire people, delegate to AI agents, or change careers as events unfold.

The world starts with plausible AI engineering and industry conditions. Later technological breakthroughs are speculative and depend on simulated research, resources, and decisions—not a predetermined calendar or an inevitable AI uprising.

**Your company is not your character.** Losing a company, funding, or influence changes the available opportunities; it does not automatically end the game.

## v0.1: small, offline, guided-choice prototype

Our first target is a **10–15 minute playable opening** in a local browser:

- Conversation-like narration with **prewritten choice buttons only**.
- A simple animated 2D pixel-art scene that reflects the current situation.
- A solo-developer starting scene and a few meaningful branching decisions.
- Game time advances only when an action is committed; closing the game pauses the world.
- Small, explicit state (for example: in-game date, money, current scene, and decisions).
- Free-to-run and easy to understand.

**Not in v0.1:** ChatGPT/OpenAI sign-in, API calls or tokens, free-form chat, multiplayer, cloud services, real AI training, and a complicated economic/world simulation.

We will add one playable mechanic at a time and validate it before expanding the design.

## Initial technical direction

- Browser-first: TypeScript, Vite, HTML/CSS; optional Canvas only if necessary for simple sprites.
- No backend, database server, or authentication.
- Local browser storage for saves when save/load is implemented.
- Keep game state and decision rules separate from presentation.

These are practical defaults, not a commitment to a large framework.

## Project documentation

- [Game design and long-term vision](docs/GAME_DESIGN.md)
- [Story paths: current flow and proposed branching web](docs/STORY_PATHS.md)
- [GitHub issues](../../issues) — small tasks, developed and reviewed individually

## Development principle

**Playable first, complexity later.** Every change should move a small, testable game forward. Do not add LLM integration or speculative systems before the guided-choice loop is fun.
