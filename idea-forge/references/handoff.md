# Synthesis and hand off

Read at the start of stage 4. Before presenting the dossier, ask the output format unless the person already chose one in this conversation (SKILL.md, second rule).

## Stage 4: dossier

Before writing, run `node <skill-dir>/scripts/freshness.ts` and re-check anything it flags. The dossier is the result the person acts on, so every finding it cites must be current or marked unverifiable.

Write `docs/discovery/dossier.md` from `templates/dossier.md`.

| Section | Content |
|---|---|
| Verdict | go, refine or stop, with the two or three findings that decide it |
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

Verdict rules:
- go: the problem is backed by current evidence: at least one finding with status current from a dated source. Undated pages and the person's estimates are assumptions, not evidence. Also, no question is tagged `blocks`, and no unmitigated risk is high on both likelihood and impact.
- refine: the idea holds but a go condition fails. List what to do next.
- stop: current evidence contradicts the problem, or a blocker has no workaround.

Success is never "it shipped". A feature being live is an output.

Ask the person to accept the verdict. Hand off only on go.

## Stage 5: handoff

Offer the rank 1 candidate feature as the recommendation; the person selects which ones to hand off. The `<feature>` slug is the kebab-case name from the Candidate features table. For each selected feature, write `docs/discovery/handoff/<feature>.md` from `templates/handoff.md`. It is neutral input for any spec-driven skill, not a plan or a spec.

The target should be able to plan without asking again what the discovery already settled. Before validating:

- Assumptions: each row carries the chosen default and the rationale, not only how to validate it. Do not leave a decision "for the plan review" when the person can settle it now: ask it as a grill question.
- Open questions: copy every open question from the dossier with its tag. Write `- None` when there are none.
- Literal text: when the person decided wording the user will see (a rule shown before payment, a message, a label), copy it word for word in the person's language.
- Surface hints: each one names who uses it and what they get back.
- Rules: each rule names its neighbouring cases in its examples (below, above, exactly at the limit, repeated). A rule that sends a message names its channel (`via WhatsApp`, `by email`, `on the order page`); a time limit says when the clock starts and in which time zone.
- Entities: `A lo..hi B` means each A has lo to hi B, with hi a number, `n` or `*`, lo at or below hi, relations separated by `;`, and each pair has one range. `validate.ts` checks this and the channel.
- Edges and Rules agree. Every state transition in Edges is caused by a rule. A conflict is a grill question, not a choice you make.
- Sources: each finding's binding mark matches `findings.md`. `validate.ts` checks this.

For a non-technical person, write each rule in plain words first, confirm it, then add the EARS line. Write the file, then run the validator.

Size estimate, which most targets use to decide depth:

| Size | Signal |
|---|---|
| small | Up to about 3 files, one sentence describes it |
| medium | Clear feature, under 10 tasks |
| large | Several components |
| complex | Ambiguity or a new domain |

Suggested verification profile, always written; the target or the repo decides whether to apply it: standard for money, health data, personal data or regulation; ui when a screen is involved; light otherwise.

Then read `references/targets.md` to pick and check the target and give its next command.

## EARS forms

```
The <system> SHALL <response>.
WHEN <trigger> THEN the <system> SHALL <response>.
WHILE <state> the <system> SHALL <response>.
IF <condition> THEN the <system> SHALL <response>.
WHERE <feature> the <system> SHALL <response>.
```

Run `node <skill-dir>/scripts/validate.ts <feature>` until it exits 0, then give the next command for the target from `references/targets.md`.
