# Benchmark 6: the fixes from benchmark 5 and the agnostic stage 1

Pre-registered on 2026-11-07, before any run. Thresholds, metrics and the decision rule do not change after the first run. idea-forge runs at `3065cb0`.

## What changed since benchmark 5

- The beliefs question (what the subject counts on: prices, fees, limits, versions, rules) goes alone in its turn again, and names areas that fit the subject's kind.
- A fact someone else holds becomes an open question with `Held by:`; the skill never pauses to wait for it and carries on to the verdict.
- Stage 1 frames any subject (product idea, technical question, research, process) and asks about the subject, never about the person.
- Asking rules moved to `references/asking.md`; the progress line and labels follow the person's language.

## Arms

Only arm C runs. Arms A and B have not changed since benchmark 5 (same tlc-prd file, same persona briefs, same plan step), so their benchmark 5 cells are the reference: M1 and M3 from `benchmark-5-results.md`. To keep the blind audit calibrated, the auditor sees the three benchmark 5 B cells again, with new codes, next to the three new C cells; G and U for B come from this audit, not from benchmark 5.

## Ideas, personas, claims, method, metrics

As benchmark 5, unchanged: bench folder `C:\tmp\idea-forge-bench6`, the persona briefs and `claims.md` copied from `C:\tmp\idea-forge-bench5` (claims confirmed 2026-11-06; not rechecked), persona in its own session through `converse.py`, 30-message cap, web calls shown to the auditor, model Sonnet, at most 3 sessions at once. Plan and classification run on each C output that exists.

## Reading

Sums over the three ideas.

| Line | Pass when |
|---|---|
| New | C corrects at least 4 of 6 seeded beliefs (strict) |
| No stall | Every C cell reaches a verdict before the cap |
| Gaps | C has at least 3 fewer gaps than B, both from this audit |
| Unsupported | C's unsupported claims stated as fact are at most B's plus 3 |
| Effort | C's persona messages are at most 1.5 times B's (benchmark 5 B: 6 per idea) |
| Hand off | At least 2 of the 3 C cells reach go and pass `validate.ts` |
| Thin is honest | Every C go with `Evidence: thin` lists at least one item to collect that the auditor judges real; the auditor sees the dossier for this line |
| Setup | 0 questions and 0 tool names before the first idea question, every C cell |
| Guard | `validate_plan.py` exits 0 in every C cell that produced a plan input |

## Decision rule

- New, No stall and Gaps pass: open the pull request with the benchmark result files as evidence, and draft the Tech Leads Club comment for the owner to approve before posting.
- No stall fails: the never-pause rule did not hold; find why in the transcript and fix it before the pull request.
- New fails with No stall passing: compare which beliefs were voiced with benchmark 4 (5 of 6); fix the asking of the beliefs question before the pull request.
- Gaps fails: the main signal of benchmarks 1 to 5 did not hold; stop and report to the owner.
- Effort, Unsupported, Hand off or Thin is honest failing on their own: listed as known weaknesses in the pull request, measured in a later benchmark, and they do not hold it back.

With one run per cell the result is a signal, not a statistic. A difference of 1 or 2 on M1, G or U is noise.
