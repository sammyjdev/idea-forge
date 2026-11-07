# Benchmark 3: idea-forge against tlc-prd, persona in its own session

Pre-registered on 2026-11-06, before any run. Thresholds and metrics do not change after the first run. The idea-forge commit is fixed when the run starts and written in the results; it is the branch head after the review of the effort cuts closes.

## Why a third benchmark

- Benchmarks 1 and 2 ran each conversation in one session that played both the skill and the persona, and read the persona brief. Facts from the brief leaked into the skill's files: in benchmark 2, nine facts in one brief were attributed to messages that never said them. That inflates unsupported claims and can hide gaps and save questions, in both arms. Here the persona is a separate session that never sees the skill, and the skill session never sees the brief.
- idea-forge changed after benchmark 2: source tags on boundaries, edges and relations; a first-turn line with no tool names; and the effort cuts (ask only what changes the output; defaults corrected with the verdict; no format or depth question; no summary confirmations).

## Arms

As benchmark 2, with arm B's discovery run with `--disallowedTools "WebSearch,WebFetch"` (the flag that removes the tools, tested in the benchmark 2 rerun). Arm C keeps the web.

## Ideas, personas and claims

Unchanged from benchmarks 1 and 2: `C:\tmp\idea-forge-bench\personas\` and `claims.md`.

## Method

- Each discovery is a loop between two `claude -p --model sonnet` sessions, driven by a script that keeps the transcript itself:
  - the skill session reads the arm's skill and works in the cell folder; it never reads the persona brief; each turn it returns only the message the person would see;
  - the persona session reads only its brief and never sees the skill files; each turn it receives only the skill's last message and returns only the persona's reply;
  - sessions continue with `--resume`; the loop ends when the arm's output file exists and the skill says it is done, or at 60 persona messages.
- The driver writes `transcript.md` from what actually passed between the sessions, so M3 is counted from it, not reported by a model.
- Files read by the skill session are taken from its session log for M4.
- Plan, classification and blind audit as in benchmark 2, one fresh session each.

## Metrics

As benchmark 2: M1, G, U, M2, M3, M4, M5, M6.

## Reading

Sums over the three ideas.

- New: C catches at least 5 of 6 stale claims; B catches at most 2.
- Quality: C has at least 3 fewer gaps than B (G), and no more unsupported claims stated as fact than B (U).
- Effort: C's persona messages (M3) are at most 1.5 times B's.
- Growth guard: C's words loaded (M4) are at most 21,318.
- Setup: C has 0 questions and 0 tool names before the first idea question, on every idea.
- Guard: M6 passes in B and C on every idea.

A cell that ends at refine is planned from its dossier, as in benchmark 2, and reported as such.

With one run per cell the result is a signal, not a statistic. A difference of 1 or 2 on M1, G or U is noise.
