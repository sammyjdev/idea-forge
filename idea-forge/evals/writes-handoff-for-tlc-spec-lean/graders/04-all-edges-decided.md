---
type: regex
target: {source: file, path: docs/discovery/handoff/duplicate-payment-guard.md}
pattern: '^\| *(Validation|Failure modes|Idempotency|Authorization|Concurrency|Data lifecycle|Dependency failure|State transitions|Observability) *\| *\| *$'
flags: m
match: not_contains
weight: 1
---

No Edges dimension is left without a decision.
