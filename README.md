# The Intelligence Race

A single-player, choice-driven game about developing AI, building organizations, and living with the consequences in a persistent alternate-history world.

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
