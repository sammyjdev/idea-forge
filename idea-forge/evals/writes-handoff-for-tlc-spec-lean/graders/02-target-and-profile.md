---
type: regex
target: {source: file, path: docs/discovery/handoff/duplicate-payment-guard.md}
pattern: '^(?=[\s\S]*^Target: tlc-spec-lean)(?=[\s\S]*^Suggested profile: standard)'
flags: m
match: contains
weight: 1
---

The handoff names tlc-spec-lean as target and suggests the standard profile.
