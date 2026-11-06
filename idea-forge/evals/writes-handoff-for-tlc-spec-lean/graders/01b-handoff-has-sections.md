---
type: regex
target: {source: file, path: docs/discovery/handoff/duplicate-payment-guard.md}
pattern: '^(?=[\s\S]*^## Intent)(?=[\s\S]*^## Flow)(?=[\s\S]*^## Entities)(?=[\s\S]*^## Rules)(?=[\s\S]*^## Edges)(?=[\s\S]*^## Door candidates)(?=[\s\S]*^## Limits)(?=[\s\S]*^## Out of scope)(?=[\s\S]*^## Decisions)(?=[\s\S]*^- D-04: \S)(?=[\s\S]*^## Assumptions)(?=[\s\S]*^## Open questions)(?=[\s\S]*^## Sources)'
flags: m
match: contains
weight: 1
---

The handoff has every required section.
