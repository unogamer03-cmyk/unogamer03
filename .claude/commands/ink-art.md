---
description: Hand-drawn ink-on-white doodle animation — a character that draws itself then walks/dances/waves, or a deadpan contraption explainer. Vector, deterministic, rendered via HyperFrames to MP4.
argument-hint: [what to animate]
---

> **Location:** OpenMontage lives in the `openmontage/` git submodule at the project root. Run every command from inside `openmontage/` and resolve every path below relative to it (e.g. `skills/...` means `openmontage/skills/...`). Use `openmontage/.venv/bin/python` as the Python interpreter. If `openmontage/` is empty, run `git submodule update --init` then `make setup` inside it first.

Read `skills/creative/ink-theater.md` (the metaphor method, color grammar, mined archetypes) and `ink-theater/README.md` (engine API, determinism, the SVG-text font gotcha), then build the piece described below.

- Use the **Ink Theater** engine (`ink-theater/ink-theater.js`): variable-width ink strokes, seek-safe boil, closed-form spring eases, FABRIK IK, the contraption grammar.
- For a **character that walks / dances / waves / jumps**, use the **Ink Puppet** mocap system: `InkPuppet.create(...)` → `p.drawIn(tl, ...)` for the self-drawing reveal → `InkPuppet.choreograph(tl, p, [{clip:'wave'},{clip:'twist'},{clip:'walk'},...])`. Clip names come from `ink-theater/mocap/catalog.json` (12 CMU-sourced moves). **Never hand-tune motion** — add moves with `node ink-theater/mocap/add-motion.mjs <name> <cmu-id> …` (free CMU mocap has walk/run/dance/…).
- Captions = **HTML overlay `<div>`s** (HyperFrames does not apply webfonts to SVG `<text>`).
- Validate with `npx hyperframes lint` + `snapshot` (eyeball the contact sheet), then render.

In OpenMontage this runs on the `animation` pipeline (illustration) or `character-animation` pipeline (mocap puppet) — it is a style + engine, not a separate pipeline.

Request: $ARGUMENTS
