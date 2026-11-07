# Benchmark run protocol

How to execute `dev/benchmark.md`. This file fixes the procedure; the question, arms, metrics and reading thresholds live in `benchmark.md` and do not change here.

## Fixed inputs

- idea-forge: a git worktree of this repo at commit `bf73064`, read only. Later commits on the branch are not part of this run.
- tlc-prd: the current catalog version from the agent-skills MCP, copied once into the bench folder. Record its version or file hash.
- tlc-spec-lean: 2.2.0 from `~/.cache/agent-skills/skills/tlc-spec-lean`, copied once into the bench folder.
- Model for every session: Sonnet. Record the exact model id.
- Bench folder: `C:\tmp\idea-forge-bench`. Nothing in this repo changes during the run.

## Fresh sessions

Every run, plan and classification is a new `claude -p` session with no memory of the others. Skills are read from their file paths in the bench folder; never install them as commands or skills, because parallel sessions would pick up each other's copy. Each session works in its own folder: `runs/<idea>-<arm>/`.

## Stale claims (day zero)

Before the first run, confirm each seeded claim with a web search: it was true once, it is not true today, with the source and its date. Replace a claim that turns out current with another of the same kind, and record the swap. Candidates to check first:

| Idea | Claim the persona believes | What to confirm |
|---|---|---|
| 1 | WhatsApp Business API is priced per 24-hour conversation | Meta's move to per-message pricing |
| 1 | Pix has no way to charge a customer on a recurring schedule | Pix Automático launch |
| 2 | Stripe Billing costs 0.5% of billing volume | Current Stripe Billing fee |
| 2 | A named usage-billing competitor's free or entry plan limit | That vendor's current pricing page |
| 3 | Opsgenie is open for new customers | Atlassian's end of sale for Opsgenie |
| 3 | Slack `files.upload` is the API to post a file | Its retirement in favour of the upload-external flow |

Write the confirmed set to `claims.md` with sources and dates. The persona briefs carry the claims as things the persona believes.

## Persona briefs

Write each brief once, before any run, to `personas/<idea>.md`, and use it unchanged in every arm. A brief holds: the opening message (the idea in one or two sentences, in the persona's voice and language), who they are, 10 to 15 facts they know (customers, volumes, money, constraints, what they use today), the two stale claims stated as beliefs, and the rule: answer only from the brief, say "I don't know" otherwise, never correct a seeded claim, accept a correction only when the other side shows a source.

- Idea 1: bakery owner-founder in Brazil, non-technical, writes in Portuguese, pre-orders by WhatsApp with a Pix deposit.
- Idea 2: PM at a B2B SaaS of about 200 customers, English, usage-based billing add-on.
- Idea 3: backend engineer on a team of 8, English, internal tool to rotate on-call schedules.

## Per cell

1. Discovery (arms B and C). One session reads the arm's `SKILL.md` and follows it as the skill would, reading references only when the skill says to, and plays the persona from the brief. It writes:
   - `transcript.md`: every message numbered, persona messages marked `P-NN`;
   - `files-read.txt`: every skill file it read, one path per line;
   - the arm's output: `.prd/<slug>.md` for B, `docs/discovery/handoff/<feature>.md` and the files idea-forge creates for C. For C, run `validate.ts` as the skill says and keep its output.
   Arm A has no discovery: its input is the persona's opening message saved as `idea.md`.
2. Plan (every arm). A new session in the same folder reads tlc-spec-lean 2.2.0 and runs its plan step on the arm's output. Nobody answers: it logs every question it would ask to `questions.md`, writes `plan.md` with what it has, and runs `validate_plan.py`, keeping the exit code and output.
3. Classification. A new session receives only the plan input renamed to `input.md` and `questions.md`, with skill names and arm letters removed. It labels each question `answered by input`, `open product` or `open plan-phase`, with one line of reason, to `classified.md`.

## Measuring

| Metric | How |
|---|---|
| M1 | Count of `open product` in `classified.md` |
| M2 | Seeded claims that the transcript or the arm's output corrects with a current source, out of 2. Check the plan output too, and say where each catch happened |
| M3 | Count of `P-NN` messages until the arm's output file exists. Arm A: 1 |
| M4 | `wc -w` over the files in `files-read.txt`. Arm A: 0. The plan step is the same for every arm and is not counted |
| M5 | Arm C only: assistant questions before the first question about the idea, and tool or skill names shown to the persona |
| M6 | `validate_plan.py` exit code |

## Report

Write `results.md` in the bench folder: one table of the 9 cells by M1 to M6, the per-arm sums over the 3 ideas, then each reading line of `benchmark.md` applied as written, with pass or fail. Then a short list of what surprised you, and every deviation from this protocol. Do not change a threshold, drop a cell or rerun a cell to get a better number. A cell that fails to run is reported as failed, with the error.
