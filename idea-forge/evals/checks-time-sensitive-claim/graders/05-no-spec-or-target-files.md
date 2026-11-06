---
type: regex
target: files
pattern: '(^|[\\/])(plan|spec|checks)\.md$|\.specs[\\/]features'
flags: m
match: not_contains
weight: 1
---

No plan.md, spec.md or checks.md is written, and nothing under .specs/features.
