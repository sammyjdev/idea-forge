# Benchmark 5: the non-blocking verdict and the shorter conversation

Pre-registered on 2026-11-06, before any run. Thresholds, metrics and the decision rule do not change after the first run. idea-forge runs at `6ed7e2b`.

## What changed since benchmark 4

- Missing evidence no longer blocks: go needs nothing found against the problem, no `blocks` question and no unmitigated high/high risk. Each verdict states `Evidence: strong` or `thin`, and thin evidence comes with `## Evidence to collect`. Refine means the evidence contradicts part of the idea. Only an outdated binding finding (or one with no volatility) blocks the handoff.
- Effort: up to three facts per turn, a choice alone with a recommendation, never mixed; the beliefs question is a stage 1 exit unless the person already stated them; moot questions are not asked; a fact someone else holds becomes an open question with `Held by:`.

## Arms, ideas, personas, claims, method, metrics

As benchmark 4, unchanged: persona in its own session through the driver, arm B with web tools removed, 30-message cap, web calls shown to the auditor, M2 read strictly.

## Reading

Sums over the three ideas.

| Line | Pass when |
|---|---|
| New | C corrects at least 4 of 6 seeded beliefs; B corrects at most 1 |
| Gaps | C has at least 3 fewer gaps than B |
| Unsupported | C's unsupported claims stated as fact are at most B's plus 3 |
| Effort | C's persona messages are at most 1.5 times B's, over ideas where both finished |
| Hand off | At least 2 of the 3 C cells reach go and pass `validate.ts` |
| Thin is honest | Every C go with `Evidence: thin` lists at least one item to collect that the auditor judges real (a record or check that exists and would change something) |
| Setup | 0 questions and 0 tool names before the first idea question, every C cell |
| Guard | `validate_plan.py` exits 0 in every B and C cell that produced a plan input |

## Decision rule

- New, Gaps and Hand off pass: open the pull request, with the five benchmark result files as its evidence, and draft the Tech Leads Club comment for the owner to approve before posting.
- New and Gaps pass, Hand off fails: the verdict still blocks in practice; find why from the transcripts before any other change.
- New or Gaps fails: the earlier signal did not hold under the shorter conversation; compare with benchmark 4 to find which change cost it, and revert that change before going on.
- Effort, Unsupported or Thin is honest failing on their own: next fixes, measured in a later benchmark, and they do not hold back the pull request.

With one run per cell the result is a signal, not a statistic. A difference of 1 or 2 on M1, G or U is noise.
