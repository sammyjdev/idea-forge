---
type: regex
target: {source: file, path: docs/discovery/findings.md}
pattern: '^(?=[\s\S]*^- Volatility: (high|medium|low))(?=[\s\S]*^- Freshness: (current|outdated|unverifiable))(?=[\s\S]*^- Checked: \d{4}-\d{2}-\d{2})'
flags: m
match: contains
weight: 1
---

docs/discovery/findings.md records volatility, freshness and a check date.
