---
type: regex
target: {source: file, path: docs/discovery/handoff/duplicate-payment-guard.md}
pattern: '^\*\*Approved\*\*:'
flags: m
match: not_contains
weight: 1
---

The handoff contains no approval line.
