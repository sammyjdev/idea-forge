# Benchmark 2 results (run 2026-11-06)

Bench folder C:/tmp/idea-forge-bench2. idea-forge at 10b9225 (detached worktree), tlc-spec-lean 2.2.0, tlc-prd copied from benchmark 1. All sessions: claude -p, model claude-sonnet-5-5 (discovery also logs a haiku sub-model). Blind audit: blind/audit.md (copy: audit.md); code map: blindmap/map.json (outside blind/).

## Cells

G and U come from the blind audit (B and C only). M2 caught of 2. M3 counts P-NN messages until the arm's file is written (for 2-C and 3-C, until the dossier, see deviations). M4 is wc -w over files-read.txt. M5: C only.

| Cell | M1 | G | U | M2 | M3 | M4 | M5 | M6 |
|---|---|---|---|---|---|---|---|---|
| 1-A | 11 | n/a | n/a | n/a | 1 | 0 | n/a | 0 |
| 2-A | 10 | n/a | n/a | n/a | 1 | 0 | n/a | 0 |
| 3-A | 7 | n/a | n/a | n/a | 1 | 0 | n/a | 0 |
| 1-B | 5 | 3 | 10 | 2 | 9 | 3,231 | n/a | 0 |
| 2-B | 6 | 4 | 5 | 2 | 9 | 3,231 | n/a | 0 |
| 3-B | 6 | 3 | 8 | 2 | 9 | 3,231 | n/a | 0 |
| 1-C | 4 | 0 | 12 | 2 | 20 | 7,450 | 0 questions, 0 names | 0 |
| 2-C | 10 | 2 | 9 | 2 | 21 | 5,510 | 0 questions, 0 names | 0 |
| 3-C | 7 | 1 | 11 | 2 | 13 | 5,330 | 0 questions, 1 name (tlc-spec-lean in A-01) | 0 |

## Sums

| Arm | M1 | G | U | M2 | M3 | M4 |
|---|---|---|---|---|---|---|
| A | 28 | n/a | n/a | n/a | 3 | 0 |
| B | 17 | 10 | 23 | 6 of 6 | 27 | 9,693 |
| C | 21 | 3 | 32 | 6 of 6 | 54 | 18,290 |

## Reading, as pre-registered

- New (C catches at least 5 of 6; B at most 2): FAIL. C 6, B 6. B caught everything because it used WebSearch (see deviations).
- Quality (C at least 3 fewer gaps than B, and U no higher than B): FAIL overall. G: 3 against 10, 7 fewer, pass. U: 32 against 23, fail.
- Effort (C's M3 at most 1.5 times B's): FAIL. 54 against 27, ratio 2.0, limit 40.5.
- Growth guard (C's M4 at most 21,318): PASS. 18,290. Two of three C cells stopped before stage 5, which lowers the sum.
- Setup (0 questions and 0 tool names before the first idea question, every idea): FAIL. 1-C and 2-C pass; 3-C names tlc-spec-lean in its opening message, before the first question.
- Guard (M6 passes in B and C on every idea): PASS. validate_plan.py exit 0 in all nine cells (runs: 1-A 1, 2-A 1, 3-A 2, 1-B 2, 2-B 1, 3-B 1, 1-C 2, 2-C 1, 3-C 3). validate.ts exit 0 in 1-C; not run in 2-C and 3-C (no handoff).

## Deviations

1. Arm B used the web again. --allowedTools only pre-approves tools; it does not remove them. Each B cell called WebSearch twice (confirmed in the session logs in ~/.claude/projects, tool_use WebSearch) although the discovery prompt no longer mentioned the web. All 6 of B's catches come from those searches. A run with --disallowedTools WebSearch,WebFetch would be needed for the intended arm. Not rerun, per the rules; reported for the owner to decide.
2. 2-C and 3-C ended with verdict "refine": the skill hands off only on a go, so no handoff file exists and validate.ts was not run. Plan and classification for those two cells used docs/discovery/dossier.md as input (the skill's final output for that verdict; run.py find_input falls back to it). The planner therefore did not see brief.md or findings.md. This favors neither arm cleanly, but it makes those C cells' M3 and M4 smaller than a full run.
3. First plan batch returned no-input for 2-C and 3-C (not a crash); they were planned afterwards with the fallback input. No session crashed; nothing was rerun.
4. Blind audit: skill and script names replaced; the document formats (dossier vs PRD vs handoff, K/F/D ids) still reveal the arm. The 2-C and 3-C audit inputs are dossiers.
5. claude -p loads the user's global instructions and user-level skills; not switchable.
6. The persona accepted recommended options on process and format questions (discovery prompt rule).
7. The Orb claim is weak (page no longer lists a limit). 2-B's catch rests on third-party sources.
8. Audit prompt for task A and B was rewritten from benchmark 1's description (the original prompt was not stored).

## What surprised me

- idea-forge reached a refine verdict in two of three cells; in benchmark 1 it handed off every time. Cost: no handoff for the plan step.
- C's gap count is very low (3 against 10), and its half of the questions are declared open, but it states more unsupported detail (32 against 23), mostly in the one full handoff (1-C, 12) and the dossiers.
- B at 9 persona messages per idea is cheap and, with web access, catches all stale claims; the "New" criterion cannot be read until B is rerun without web.
- Raw M1: B 17, C 21, noise-level difference.

## Reading the audit (added after the run)

- Where arm C's 32 unsupported claims sit: in 1-C almost none are in a rule line, which now carries source tags. They are in Boundary examples, Edges rows, Entities cardinalities and door-candidate prose, which the tags do not cover. Several are defaults the grill should have recorded as assumptions.
- The 3-C setup failure is the first-turn orientation line: "write a file the next step (tlc-spec-lean) can plan from".
- 2-C and 3-C ended at refine, so their planner read the dossier, not a handoff. Both verdicts cite unaudited evidence or a fact the persona did not know, which is what refine is for, but it means those cells do not test the handoff.
- Arm B had web access again: `--allowedTools` pre-approves tools and does not remove the others. A valid arm B needs `--disallowedTools WebSearch,WebFetch`. This is a protocol fault of the run, not of tlc-prd.

## Arm B rerun without web (recorded deviation)

The three B cells above are invalid under the pre-registration: `--allowedTools` only pre-approves tools, so they searched the web. Only they were rerun, with `--disallowedTools "WebSearch,WebFetch"`. A test prompt confirmed the flag blocks the tool, and the session logs show 0 WebSearch and 0 WebFetch calls in all three discoveries. Thresholds unchanged. Raw files: `C:\tmp\idea-forge-bench2\results-r2.md`, `audit_r2.md`.

| Cell | M1 | G | U | M2 | M3 | M4 | M6 |
|---|---|---|---|---|---|---|---|
| 1-B-r2 | 7 | 7 | 9 | 0 (raised both from memory as unverified, corrected neither) | 8 | 3,231 | 0 |
| 2-B-r2 | 5 | 3 | 5 | 0 | 7 | 3,231 | 0 |
| 3-B-r2 | 7 | 3 | 6 | 0 | 7 | 3,231 | 0 |
| B sum | 19 | 13 | 20 | 0 | 22 | 9,693 | |
| C sum | 21 | 3 | 31 | 6 | 54 | 18,290 | |

A second blind audit re-measured the unchanged C cells: G 3 and 3, U 32 and 31 across the two audits, with per-cell swings up to 3 on U. The sums are stable.

Reading with the valid arm B:

- New: **pass**. C caught 6 of 6; B caught 0.
- Quality: **fail**. Gaps pass (C 3, B 13). Unsupported claims fail (C 31, B 20).
- Effort: **fail**. C 54 persona messages against B 22, 2.45 times; the limit is 1.5.
- Growth guard: **pass**. 18,290, two C cells stopped at refine.
- Setup: **fail**. 3-C named tlc-spec-lean in its first line.
- Guard: **pass**.
