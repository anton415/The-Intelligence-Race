# Game Design — The Intelligence Race

**Status:** working design. This document records the agreed direction; features under "Later" are **not** part of v0.1.

## Player fantasy

You begin as an independent AI developer in a grounded, recognizable AI industry. Create a useful AI system; choose what to research, build, publish, sell, or keep private. You may found a company, hire people, delegate to AI agents, join other organizations, become a safety investigator, or change your goals entirely.

The game follows **the player and the evolving world**, not the survival of one company. Bankruptcy, dismissal, research failure, and loss of ownership change the player's options but never automatically cause Game Over. Previous AI systems, relationships, and events persist where the simulation warrants it.

## Gameplay presentation

The main interaction is a **chat-like story feed**: a narrator or character presents the situation and the player chooses an action.

- **v0.1:** only authored choices; **no text input**, live language model, or OpenAI account connection.
- **Later:** optional free-form natural-language actions and richer character dialogue, constrained by the game's simulation state.
- A simple, animated 2D **pixel-art scene** shows the character's circumstances (lone desk, startup office, lab, possible later crises). It communicates change rather than functioning as a movement/action game.
- The player should always understand major resource costs and risks; outcomes need not be certain.

## Time and continuity

- New games begin on the player's real-world calendar date. The in-game timeline diverges from reality when play begins.
- **Turn-based/event-driven:** inspecting information normally costs no time; committing actions or explicitly waiting advances the in-game clock by a specified amount.
- Long-running projects and rival organizations advance on that same clock.
- The world **fully pauses between sessions**; no idle timers or offline advancement.
- Important events may interrupt an extended wait.
- Saving must eventually preserve in-game time, resources, decisions, running projects, and important history.

## World model (future direction)

### Realistic start, speculative future

Start with credible AI engineering: existing models, agent tools, data, inference cost, compute availability, testing, and deployment. A solo developer can make a useful agent but cannot cheaply train a frontier-scale model.

Speculative developments (such as very capable autonomous scientific research or widespread robotics) require prior breakthroughs, funding, infrastructure, and supporting world events. They **do not unlock in fixed years**. Neither beneficial superintelligence nor an AI crisis is inevitable.

### Research and AI systems

A project can improve or trade off capability, specialization, reliability, cost, tool access, and autonomy. Tests provide evidence, not guaranteed progress. Separate *what a system can do* from *what it is permitted to do*. Multiple deployed versions may have different owners, memories, and permissions.

### Competitors

Use real historical AI technology and industry context, but simulate the future primarily through **fictional** organizations. Candidate fictional rivals: Copperfin AI (coding tools), Openforge Collective (open research), Vela Systems (enterprise), Asterion Research (frontier models).

Organizations have money, people, compute, strategy, projects, and relationships. They can fail, cooperate, negotiate, release products, and change direction without centering every event on the player.

### Imperfect information

Separate private world truth from observable evidence and the player's knowledge. Public announcements are claims, not verified results. Investigations, benchmarks, and relationships provide partial information. A narrator or NPC must never reveal inaccessible private state.

### Characters and relationships

Human and AI characters have limited knowledge and persistent histories. Conversations may produce commitments, opportunities, refusals, and relationship changes. Human and AI behavior differ: AI operation depends on architecture, tools, memory, delegated objectives, and permissions rather than an automatic "evil" meter.

## Rules for a future AI-assisted version

If an LLM is added, it may interpret requests or narrate **validated** outcomes; it must not directly mutate authoritative game state. The rules engine decides feasibility, time, costs, and consequences. Authentication, optional user-funded inference, and usage limits need separate design and approval. Do not assume that a ChatGPT subscription can be spent as arbitrary API tokens.

## v0.1 scope

A **small 10–15 minute browser-playable opening**, not a comprehensive simulation:

1. Intro scene: solo developer, desk, subtle pixel-style animation.
2. Narrator text and a few prewritten choices that visibly branch.
3. Minimal state/date/money when needed; effects of actions are understandable.
4. Time progresses only for committed actions.
5. Save and reload locally once the basic loop works.
6. A clear playable short-term objective and at least one consequence.

The exact opening story and numeric balance will be adjusted after playtesting. For v0.1, competitors, ECHO's development, and failures can be represented by authored events; complex systems come later.

### Explicit exclusions

No sign-in; no OpenAI or other API; no free-form input; no server; no multiplayer; no simulated model training; no automatic background progress; no massive dialogue tree; no real-world-data ingestion.

## Implementation order

1. **Playable opening screen** — scene, narrator, three choices, visible response.
2. Minimal game state and explicit time advancement.
3. First simple AI project and a consequential outcome.
4. Local save/load and restart.
5. Playtest and decide what mechanic adds the most fun.

Prefer the simplest architecture that keeps **game rules and presentation separate**. Add no infrastructure until a playable need justifies it.
