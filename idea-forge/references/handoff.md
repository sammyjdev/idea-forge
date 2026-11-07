# Hand off

Read at the start of stage 5, after the person accepted a go verdict on something to be built (code, a system, a product change). For any other subject the dossier is the end: write no handoff.

Offer the rank 1 candidate feature as the recommendation; the person selects which ones to hand off. The `<feature>` slug is the kebab-case name from the Candidate features table. For each selected feature, write `docs/discovery/handoff/<feature>.md` from `templates/handoff.md`. It is neutral input for any spec-driven skill, not a plan or a spec.

The target should be able to plan without asking again what the discovery already settled. Before validating:

- Assumptions: each row carries the chosen default and the rationale, not only how to validate it. Do not leave a decision "for the plan review" when the person can settle it now: if it is a trade-off or on a risky path, ask it as one grill question; otherwise record it as an assumption.
- Open questions: copy every open question from the dossier with its tag, and each item under Evidence to collect as a question tagged `open` with what it would change. Write `- None` when there are none.
- Literal text: when the person decided wording the user will see (a rule shown before payment, a message, a label), copy it word for word in the language the user will see, even when the conversation and the files are in another one.
- Surface hints: each one names who uses it and what they get back.
- Rules: each rule names its neighbouring cases in its examples (below, above, exactly at the limit, repeated). A rule that sends a message names its channel (`via WhatsApp`, `by email`, `on the order page`); a time limit says when the clock starts and in which time zone.
- Entities: `A lo..hi B` means each A has lo to hi B, with hi a number, `n` or `*`, lo at or below hi, each relation written in full (`A 1..1 Key; A 0..n Refund`, not `A 1..1 Key and 0..n Refund`) and separated by `;`, and each pair has one range. `validate.ts` refuses a broken relation and warns on a rule that messages a person with no channel; a warning still needs fixing or a reason.
- Edges and Rules agree. Every state transition in Edges is caused by a rule. A conflict is a grill question, not a choice you make.
- Decisions: list every `D-NN` from `brief.md` with where it lands, or why it is not for this feature. `validate.ts` checks this.
- Sources: each finding's binding mark matches `findings.md`. `validate.ts` checks this.
- Traceability: each rule, each Boundary example and each Edges decision ends with the IDs its values come from, and each Entities relation carries one, `[D-03, K-01]`: a decision, a fact the person stated (`K-NN` in `brief.md`), a finding or an assumption. A preferred door option cites one too. A value with no source becomes an assumption: add it to `brief.md` as `A-NN` with `Confirmed? n`, add the same row to the dossier's Assumptions, list it in the handoff summary for the person to correct, cite `[A-NN]` in the rule, and list it in the Assumptions table with its ID first (`A-03: window length`). Never write it into a rule as fact. Never copy a value agreed for one rule to another rule, and never turn an option found in research into the person's choice. An Edges decision nobody made (a log, a fallback, a retention period) is an assumption, never a fact. `validate.ts` refuses a rule, Boundary or Edges decision with no tag (an Edges cell reading `n/a - reason`, `existing - guard` or `Q-NN` needs none), any tag that does not exist and an Edges `Q-NN` missing from Open questions in `brief.md`, and warns on an untagged relation.

For a non-technical person, write each rule in plain words first, then the EARS line, and show the plain words in the handoff summary. In the file the numbered line is the EARS rule; the plain words go on an indented `Plain words:` line right under it, beside Normal and Boundary. A numbered line in plain words fails `validate.ts`. Write the file, then run the validator.

Size estimate, which most targets use to decide depth:

| Size | Signal |
|---|---|
| small | Up to about 3 files, one sentence describes it |
| medium | Clear feature, under 10 tasks |
| large | Several components |
| complex | Ambiguity or a new domain |

Suggested verification profile, optional: how hard the build step should check this feature. Write it when light is not enough: `standard` for money, health data, personal data, regulation or a change people cannot undo; `ui` when a screen is the result the person judges. Leave the line out for light, except when the brief says `Depth: thorough`: then write `light` with the reason, or the validator warns that light may be too little.

Then read `references/targets.md` to pick the target and give its next command.

## EARS forms

```
The <system> SHALL <response>.
WHEN <trigger> THEN the <system> SHALL <response>.
WHILE <state> the <system> SHALL <response>.
IF <condition> THEN the <system> SHALL <response>.
WHERE <feature> the <system> SHALL <response>.
```

Run `node <skill-dir>/scripts/validate.ts <feature>`. Some errors block the handoff: a binding finding outdated or with no volatility, a question tagged `blocks`, no dossier, or a verdict other than go. On one of these, give no target command: say what blocks and go back to the stage that fixes it (research for a finding, the grill for a question, synthesis for the dossier or verdict). Every other error is format: fix it and run again, at most three runs in all, then list what remains as gaps in the handoff summary. Then give the next command for the target from `references/targets.md`.
