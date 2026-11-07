# Synthesize

Read at the start of stage 4. Present in tables unless the person asked for another format (SKILL.md, second rule).

Before writing, run `node <skill-dir>/scripts/freshness.ts` and re-check on the web what it flags whose source is on the web. A flagged record of the person's, or an unverifiable finding, is not searched again: it goes under Evidence to collect (`references/freshness.md`). The dossier is the result the person acts on, so every finding it cites must be current, marked unverifiable, or listed to collect.

Write `docs/discovery/dossier.md` from `templates/dossier.md`.

| Section | Content |
|---|---|
| Verdict | go, refine, not now or stop, with the two or three findings that decide it, and `Evidence: strong` or `thin` |
| Problem | Stage 1 sentence and kind, backed by findings |
| Success | Worked if, in the problem's own unit. Early signal. Review date or trigger. What the person did not state is marked as the assistant's proposal |
| Evidence | Per RQ: status, strongest findings, outdated claims corrected, contradictions settled |
| Users | From the grill, with the finding behind each claim |
| Options | When more than one approach exists, including the cheaper-than-building ones: weighted comparison and recommendation. Weights and scores are labelled as the assistant's assessment, with the findings behind them |
| Decisions | What was decided and why. ADR links where written |
| Risks | Likelihood, impact, mitigation, sorted by score. Ratings are labelled as the assistant's assessment |
| Assumptions | Every `A-NN` from `brief.md` with its default, a way to validate it and `Confirmed? y/n`. `validate.ts` refuses a dossier that leaves out an unconfirmed one |
| Open questions | Tagged `blocks`, `blocks go-live` or `open`. A question with `Held by:` goes under Evidence to collect instead, not here |
| Evidence to collect | Under any verdict, each open question someone else holds (`Held by:` in `brief.md`); with thin evidence, also each record or check that would strengthen it. How to get it and what it would change. Suggestions, not conditions |
| Candidate features | Ranked by value and risk, each with a one-line goal and a size estimate, labelled as the assistant's assessment |

Lead with what the focus needs: business with the verdict, market evidence and cheaper-than-building options; product with the problem, users and success; technical with decisions, door candidates, risks and feasibility; design with the journey, its states and open design questions; process with the current process, who is affected, the rules that bind it and the verdict; mixed with the verdict, then one short summary per area.

## Verdict

This is discovery, not a gate. Missing evidence never blocks an idea; it becomes advice on what to collect.

- go: nothing found contradicts the problem, no question is tagged `blocks`, and no unmitigated risk is high on both likelihood and impact. A go on something smaller or different than the idea is a new proposal: say which part of the measured cost it removes and which it leaves.
- refine: current evidence contradicts part of the idea, and a changed version is recommended. Say what to change. Missing data is not a reason to refine.
- not now: worth doing, but after something else. Say what stalls while it waits and what would be built twice if it came later.
- stop: current evidence contradicts the problem, or a blocker has no workaround.

Under every verdict, write `Evidence: strong` or `Evidence: thin`. Strong means at least one current finding from a dated source backs the problem; the person's own dated record (an order notebook, a spreadsheet, a bank statement) counts. Thin means it rests on figures from memory, estimates or undated pages (`references/freshness.md`). With thin evidence, list under `## Evidence to collect` each record or check that would strengthen it: what to get, how, and which assumption or decision it would confirm or change. These are suggestions for the person, never conditions; the handoff carries them as open questions tagged `open`. Thin evidence on a risky path (money, health data, personal data, regulation, a change people cannot undo) is named as a risk under Risks, rated by its impact, so the person sees it; it blocks only when that risk is high on both likelihood and impact and has no mitigation. `validate.ts` refuses a go dossier with no evidence line, or thin evidence and nothing to collect.

Not now and stop argue for themselves in the same unit as the cost of building: what staying as is costs, and what would have to become true to reopen it. Their dossier keeps Verdict, Problem and Evidence, and puts the reopen condition under Next action. Do not invent options or candidate features for work you just declined.

When stage 1 recorded a committed decision, the verdict is a record, not a gate: `go. Committed by <who> on <date>.` Stop only if the evidence contradicts the commitment.

Success is never "it shipped". A feature being live is an output.

State the verdict with its reason, then the unconfirmed assumptions as one table (ID, proposed default, why it matters), the ones that feed a rule or sit on a risky path first, and ask for one answer: accept the verdict and correct any assumption. Each correction becomes `D-NN`. An assumption the person does not correct stays `Confirmed? n`: accepting the verdict is not confirming the defaults. Then stop and wait. Write the dossier only after the person accepts it, and hand off only on go. Stage 5 is only for something to be built (code, a system, a product change). For any other subject, such as a process change or a pure research question, the dossier is the end: Next action names the first step, and no handoff is written.
