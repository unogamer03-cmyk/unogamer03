---
description: Open the Backlot living storyboard — the browser board that shows pipeline stages, script, scene plan, and generated assets live as a production runs.
argument-hint: [project-id (optional — defaults to the current/most recent project)]
---

> **Location:** OpenMontage lives in the `openmontage/` git submodule at the project root. Run every command from inside `openmontage/` and resolve every path below relative to it (e.g. `skills/...` means `openmontage/skills/...`). Use `openmontage/.venv/bin/python` as the Python interpreter. If `openmontage/` is empty, run `git submodule update --init` then `make setup` inside it first.

Open the Backlot board for the requested project:

```bash
cd openmontage && .venv/bin/python -m backlot open $ARGUMENTS
```

- No argument → open the library view (all projects): `cd openmontage && .venv/bin/python -m backlot open`
- The command is idempotent: it starts the Backlot server if it isn't running, then opens the browser at the project's board.
- If the command fails, report it and continue with whatever the user asked — the board is an observer, never a blocker.
- The board derives everything from disk (`projects/<id>/` checkpoints, artifacts, assets, events). You never update the UI manually; keep checkpoints and artifacts honest per `skills/meta/checkpoint-protocol.md` and the board stays honest too.
