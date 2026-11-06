---
type: regex
target: {source: file, path: docs/discovery/handoff/duplicate-payment-guard.md}
pattern: '^(?=[\s\S]*^### S\d+.*\(P1\))(?=[\s\S]*^\s*\d+\.\s+(WHEN|IF)\b.*\bTHEN\b.*\bSHALL\b.*409)(?=[\s\S]*24 ?([Hh]ours|h)\b)(?=[\s\S]*^\s*Normal:)(?=[\s\S]*^\s*Boundary:)'
flags: m
match: contains
weight: 1
---

Rules are under a P1 slice heading, one EARS rule returns 409, the 24 hour window appears, and rules carry Normal and Boundary examples.
