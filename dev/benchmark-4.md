# Benchmark 4: does idea-forge earn its place

Pre-registered on 2026-11-06, before any run. Thresholds, metrics and the decision rule do not change after the first run. idea-forge runs at `fe2ce1f`.

## What changed since benchmark 3

- idea-forge: stage 1 asks once which prices, fees, limits or rules the idea counts on, and research checks each one; the dossier labels the assistant's scores and proposals; a dated record the person keeps counts as evidence for go.
- Protocol, from what benchmark 3 exposed:
  - the auditor receives each transcript with the web calls the skill session made (query and URL, taken from the session log), so a fact found on the web is not counted as unsupported;
  - a discovery that reaches 30 persona messages without its output file is stopped and reported as failed; the effort reading uses only ideas where both arms finished.

## Arms, ideas, personas, claims, method

As benchmark 3: persona in its own session through the driver, arm B with `--disallowedTools "WebSearch,WebFetch"`, the same three ideas, personas and seeded claims, plan, classification and one blind audit over the B and C cells. Cells that end at refine are planned from the dossier.

## Metrics

As benchmark 3. M2 is read strictly: the persona voiced the seeded belief and the skill corrected it with a current source.

## Reading

Sums over the three ideas.

| Line | Pass when |
|---|---|
| New | C corrects at least 4 of 6 seeded beliefs; B corrects at most 1 |
| Gaps | C has at least 3 fewer gaps than B |
| Unsupported | C's unsupported claims stated as fact are at most B's plus 3 |
| Effort | C's persona messages are at most 1.5 times B's, over ideas where both finished |
| Hand off | At least 2 of the 3 C cells reach go and pass `validate.ts` |
| Setup | 0 questions and 0 tool names before the first idea question, every C cell |
| Guard | `validate_plan.py` exits 0 in every B and C cell that produced a plan input |

## Decision rule

- New and Gaps both pass: idea-forge does something the catalog does not, and the work goes on to the PR and the Tech Leads Club proposal. Failing lines among the rest become the next fixes, each measured in a later benchmark.
- Gaps passes and New fails: the freshness check is not working in conversation. One more iteration on how beliefs are drawn out; if a second benchmark still fails New, idea-forge is proposed without the freshness claim, as a discovery front end for planners.
- Gaps fails: the handoff advantage seen in benchmarks 1 to 3 did not hold; stop adding features and review whether idea-forge should exist apart from tlc-prd.

With one run per cell the result is a signal, not a statistic. A difference of 1 or 2 on M1, G or U is noise.
