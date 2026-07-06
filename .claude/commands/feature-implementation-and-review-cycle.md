---
name: feature-implementation-and-review-cycle
description: Workflow command scaffold for feature-implementation-and-review-cycle in wallcast.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-implementation-and-review-cycle

Use this workflow when working on **feature-implementation-and-review-cycle** in `wallcast`.

## Goal

Implements a major feature across multiple files, followed by iterative code review fixes and improvements.

## Common Files

- `README.md`
- `join.html`
- `keys/gen.js`
- `spike.html`
- `wall.html`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Implement feature across relevant files (HTML, JS, README, etc.)
- Commit initial implementation
- Review code (internally or via automated tools like CodeQL)
- Address review findings: fix bugs, improve security, clarify comments, update documentation
- Commit fixes and improvements

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.