# The Intelligence Race

A single-player, choice-driven game about developing AI, building organizations, and living with the consequences in a persistent alternate-history world.

## Play now

**[Play The Intelligence Race](https://anton415.github.io/The-Intelligence-Race/)**

The first release, **v0.1.0**, is the playable opening scene. Try all three choices
and restart between them. We will expand the game in small, playable updates.

The GitHub Pages site rebuilds and updates automatically whenever changes merge
into `main`. Versioned snapshots and release notes are available in
**[GitHub Releases](https://github.com/anton415/The-Intelligence-Race/releases)**.
The live site follows `main`, so it may include changes newer than the latest release.

## Play the opening screen locally

Use Node.js 20.19+ (20.x), or 22.12+ and npm, as required by [Vite](https://vite.dev/guide/).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173/The-Intelligence-Race/).

```bash
npm run build    # Type-check and build into dist/
npm run preview  # Serve the production build locally
npm test         # Check state transitions, local dates, boundaries, and restart
```

The production preview uses the same `/The-Intelligence-Race/` path as GitHub Pages.

The opening has one pixel-style developer room with a blinking monitor, an
introduction, and exactly three choices. Each has a fixed, distinct outcome and
shows its duration and resource changes before selection, including unchanged resources.
The status panel displays the in-game date, money in USD, and research progress in points.
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

Each choice applies its effects **once**, then shows its authored outcome and scene
caption. Time advances in calendar days, including across month/year boundaries
and daylight-saving changes. Waiting, inspecting, or leaving the game does not
advance time or resources. Restart creates a fresh opening with the current local
date and starting resources, restores all three choices, and focuses the first one.
There is no saving yet: reloading also starts a new game.

The game runs entirely in the browser. It uses local CSS artwork and prewritten
text: no API calls, sign-in, backend, or remote assets. The community conversation
is fictional; choosing it does not send a real message. Installing dependencies
requires internet access; playing through the local server does not.

Story data and decision state live in `src/game.ts`; `src/main.ts` presents them,
and `src/style.css` draws the room. Starting resources, choice effects, and transition
rules are all in `src/game.ts`. This is only the opening interaction, not the full
v0.1 described below. Saving and further turns are not implemented.

To check the slice manually: note the opening date/resources and each choice's
advertised effects, try all three choices, and restart after each. Confirm the
resulting date/resources match those effects, each response repeats exactly from
the same starting state, and repeated activation or waiting changes nothing.
Try the same loop with the keyboard and a narrow viewport.

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
- [GitHub issues](../../issues) — small tasks, developed and reviewed individually

## Development principle

**Playable first, complexity later.** Every change should move a small, testable game forward. Do not add LLM integration or speculative systems before the guided-choice loop is fun.
