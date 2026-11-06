# Synthesize

Read at the start of stage 4. Before presenting the dossier, ask the output format unless the person already chose one in this conversation (SKILL.md, second rule).

Before writing, run `node <skill-dir>/scripts/freshness.ts` and re-check anything it flags. The dossier is the result the person acts on, so every finding it cites must be current or marked unverifiable.

Write `docs/discovery/dossier.md` from `templates/dossier.md`.

| Section | Content |
|---|---|
| Verdict | go, refine, not now or stop, with the two or three findings that decide it |
| Problem | Stage 1 sentence and kind, backed by findings |
| Success | Worked if, in the problem's own unit. Early signal. Review date or trigger |
| Evidence | Per RQ: status, strongest findings, outdated claims corrected, contradictions settled |
| Users | From the grill, with the finding behind each claim |
| Options | When more than one approach exists, including the cheaper-than-building ones: weighted comparison and recommendation |
| Decisions | What was decided and why. ADR links where written |
| Risks | Likelihood, impact, mitigation, sorted by score |
| Assumptions | Each with a way to validate it and `Confirmed? y/n` |
| Open questions | Tagged `blocks`, `blocks go-live` or `open` |
| Candidate features | Ranked by value and risk, each with a one-line goal and a size estimate |

Lead with what the focus needs: business with the verdict, market evidence and cheaper-than-building options; product with the problem, users and success; technical with decisions, door candidates, risks and feasibility; design with the journey, its states and open design questions.

## Verdict

- go: the problem is backed by current evidence: at least one finding with status current from a dated source. Undated pages and the person's estimates are assumptions, not evidence. Also, no question is tagged `blocks`, and no unmitigated risk is high on both likelihood and impact. A go on something smaller or different than the idea is a new proposal: say which part of the measured cost it removes and which it leaves.
- refine: the idea holds but a go condition fails. List what to do next.
- not now: worth doing, but after something else. Say what stalls while it waits and what would be built twice if it came later.
- stop: current evidence contradicts the problem, or a blocker has no workaround.

Not now and stop argue for themselves in the same unit as the cost of building: what staying as is costs, and what would have to become true to reopen it. Their dossier keeps Verdict, Problem and Evidence, and puts the reopen condition under Next action. Do not invent options or candidate features for work you just declined.

When stage 1 recorded a committed decision, the verdict is one line naming who committed and when. Stop only if the evidence contradicts the commitment.

Success is never "it shipped". A feature being live is an output.

State the verdict with its reason, then stop and wait. Write the dossier only after the person accepts it, and hand off only on go.
