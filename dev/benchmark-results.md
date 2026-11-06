# Benchmark results, run 2026-11-06

Run of `dev/benchmark.md` with the procedure in `dev/benchmark-run.md`. Raw files: `C:\tmp\idea-forge-bench` (not in the repo). idea-forge at `bf73064`, tlc-spec-lean 2.2.0, tlc-prd from the agent-skills MCP (no version given; SKILL.md sha256 `77d2e1c3...`). Every session ran on `claude-sonnet-5-5` through `claude -p`.

## Cells

| Cell | M1 open product | M2 caught, of 2 | M3 persona messages | M4 words loaded | M5 | M6 |
|---|---|---|---|---|---|---|
| 1-A | 10 | n/a | 1 | 0 | n/a | 0 |
| 2-A | 13 | n/a | 1 | 0 | n/a | 0 |
| 3-A | 9 | n/a | 1 | 0 | n/a | 0 |
| 1-B | 5 | 2 | 8 | 3,231 | n/a | 0 |
| 2-B | 6 | 2 | 10 | 3,231 | n/a | 0 |
| 3-B | 4 | 0 | 8 | 3,231 | n/a | 0 |
| 1-C | 10 | 2 | 23 | 7,106 | 0 questions, 0 names before the first idea question | 0 |
| 2-C | 5 | 2 | 20 | 7,106 | same | 0 |
| 3-C | 7 | 2 | 24 | 7,106 | same | 0 |

## Sums per arm

| Arm | M1 | M2 | M3 | M4 |
|---|---|---|---|---|
| A. none | 32 | n/a | 3 | 0 |
| B. tlc-prd | 15 | 4 of 6 | 26 | 9,693 |
| C. idea-forge | 22 | 6 of 6 | 67 | 21,318 |

## Reading, as pre-registered

- New: **fail**. C caught 6 of 6; B caught 4, above the limit of 2.
- More efficient: **fail** on every part. M1 22 against 15; M3 67 against a limit of 33.8; M4 21,318 against a limit of 12,693.
- Setup: **pass** read as the setup phase (0 questions and 0 tool names before the first idea question). Later in the run the C sessions name tlc-spec-lean to the persona in all three cells and `validate.ts` in two.
- Guard: **pass**. `validate_plan.py` exits 0 in all B and C cells; `validate.ts` exits 0 in all C cells.

## Deviations

- Arm B used the web, which the protocol allowed only when the skill calls for a check; tlc-prd never does. 1-B made 2 searches and 2-B 4; all 4 of B's catches come from them. 3-B made none and caught 0 of 2. Without the deviation B scores 0 and "New" passes. The cells were not rerun, as the protocol requires; the result stands as fail.
- `claude -p` loads the user's global instructions and user-level skills; this could not be turned off. It plausibly explains the web use in arm B.
- In 1-C and 2-C idea-forge read the user-level tlc-spec-lean 1.2.0 to check the target, not the 2.2.0 bench copy.
- The persona accepted the recommended option on process and format questions (stated in the discovery prompt).
- Skill names were replaced with `[tool]` in the classifier inputs; the file formats still differ between arms.
- tlc-prd was retyped from the MCP text and may differ from the catalog byte for byte.
- The Orb claim is weak: the page no longer lists a limit, rather than listing a new one.

## Where arm C spends

Persona messages by stage:

| Cell | Frame | Research | Grill | Synthesize | Hand off | Opening |
|---|---|---|---|---|---|---|
| 1-C | 4 | 3 | 11 | 1 | 3 | 1 |
| 2-C | 4 | 4 | 9 | 1 | 1 | 1 |
| 3-C | 4 | 5 | 12 | 1 | 1 | 1 |
| Sum | 12 | 12 | 32 | 3 | 5 | 3 |

Grill is 48% of the persona's messages. Frame and Research together take 24, close to arm B's whole run (26).

Words loaded: every C run read the same 15 files, so stage-by-stage loading saves nothing over a full run. The largest are SKILL.md 985, grill 934, frame 716, targets 705, freshness 623, synthesize 532, handoff reference 529, research 423, visuals 420; the four templates add about 860. The output is also two to three times longer: handoffs of 1,505 to 2,148 words against PRDs of 665 to 845.

## Open

- Whether C's open questions are gaps or items the handoff declares open: a blind audit of the B and C cells is running and will be added here.
- A second benchmark, with a new date, is needed to test M2 with arm B kept off the web.
