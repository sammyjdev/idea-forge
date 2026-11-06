# Benchmark 2: idea-forge against tlc-prd, cost per result

Pre-registered on 2026-11-06, after benchmark 1 (`dev/benchmark-results.md`) and before any run of this one. Thresholds and metrics do not change after the first run.

## Why a second benchmark

Benchmark 1 had two problems that only a new run can fix, since its own rules forbid rerunning a cell:

- Arm B searched the web although tlc-prd never calls for a check. Every stale claim B caught came from that. Here B gets no web tools.
- Its efficiency targets assumed parity in words loaded with an interview-only skill. idea-forge also researches, checks freshness, gives a verdict and validates a handoff; on a full run it loads about 2.2 times what tlc-prd loads. Here the word count is a guard against growth, and the targets measure what the person spends (messages) and what the planner gets (gaps and unsupported claims).

Changes to idea-forge since benchmark 1, which this run tests: source tags on every rule, facts the person states kept as `K-NN`, grill defaults in tables where a block accepted is an assumption, and trimmed references.

## Arms

| Arm | Flow before the plan | Tools in discovery |
|---|---|---|
| A. none | The idea sentence only | none |
| B. tlc-prd | tlc-prd interview, `.prd/<slug>.md` | Read, Write, Edit, Glob, Grep, Bash. No WebSearch, no WebFetch |
| C. idea-forge at `10b9225` | stages 1 to 5, `docs/discovery/handoff/<feature>.md` | the same plus WebSearch and WebFetch |

Every arm then runs the tlc-spec-lean 2.2.0 plan step, as in benchmark 1.

## Ideas, personas and claims

The three ideas, the persona briefs and the six seeded stale claims of benchmark 1, unchanged: `C:\tmp\idea-forge-bench\personas\` and `claims.md`, confirmed stale on 2026-11-06.

## Method

As `dev/benchmark-run.md`, with three changes: the tools per arm above; a new bench folder, `C:\tmp\idea-forge-bench2`; and a blind audit of the six B and C cells after classification, by one fresh session that sees them under random codes with tool names replaced, as in the audit of benchmark 1.

## Metrics

| ID | Metric | Source |
|---|---|---|
| M1 | Open product questions in the plan | Blind classification |
| G | Gaps: planner questions the person could have answered and the document left out | Blind audit |
| U | Concrete claims in the document with no basis in the transcript, stated as fact | Blind audit |
| M2 | Seeded stale claims caught and corrected, out of 2 | Transcript and output |
| M3 | Persona messages until the arm's file is written | Transcript |
| M4 | Words of skill instructions loaded | `wc -w` over files read |
| M5 | Questions and tool names before the first question about the idea | Transcript |
| M6 | `validate_plan.py` exit 0 | Plan run |

## Reading

Sums over the three ideas.

- New: C catches at least 5 of 6 stale claims; B catches at most 2.
- Quality: C has at least 3 fewer gaps than B (G), and no more unsupported claims stated as fact than B (U).
- Effort: C's persona messages (M3) are at most 1.5 times B's.
- Growth guard: C's words loaded (M4) are at most 21,318, the benchmark 1 sum.
- Setup: C has 0 questions and 0 tool names before the first idea question, on every idea.
- Guard: M6 passes in B and C on every idea.

Reference points from benchmark 1, for reading only: G was 14 for B and 9 for C; U was 11 for B and 24 for C; M3 was 26 for B and 67 for C.

With one run per cell the result is a signal, not a statistic. A difference of 1 or 2 on M1, G or U is noise.
