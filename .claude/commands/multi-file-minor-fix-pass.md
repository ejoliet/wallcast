---
name: multi-file-minor-fix-pass
description: Workflow command scaffold for multi-file-minor-fix-pass in wallcast.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /multi-file-minor-fix-pass

Use this workflow when working on **multi-file-minor-fix-pass** in `wallcast`.

## Goal

Applies minor fixes, clarifications, and improvements across several related files in response to feedback or bug reports.

## Common Files

- `join.html`
- `keys/gen.js`
- `wall.html`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Identify minor issues or improvements across multiple files (e.g., error messages, comments, warnings)
- Apply targeted fixes and clarifications
- Commit all minor changes together

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.