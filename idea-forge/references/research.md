# Research

Read at the start of stage 2. Every check follows `references/freshness.md`.

## Problem kind

Decide the kind in stage 1. It changes which questions make sense.

| Kind | Meaning | Anchor questions |
|---|---|---|
| Pain | Something happens now and costs something | Who hurts? What does it cost today, in the unit the business feels? What happens if nothing changes? |
| Absence | A capability is missing; nobody is hurt because nobody is doing it | Who cannot do this today? What do they do instead? The substitute is the evidence |
| Construction | The next piece of something still being built | What was this piece promised to enable? What stalls without it? Why now and not after the next piece? |

Never run pain questions on an absence or construction problem. "What breaks if we do nothing" answers itself under absence, and the empty answer is not a weak case.

## Research questions

Stage 1 ends with 3 to 8 research questions, `RQ-NN`, each tied to a risk of the idea. For each one, write first which answer would change the decision. Data with no decision attached is noise.

| Area | Typical question |
|---|---|
| Problem | Does it exist at the stated size? What do people use today? |
| Users | Who has it, who pays, how do they decide? |
| Market | Who solves it already, at what price, with what gaps? |
| Regulation | Which laws, standards or licenses apply where it will run? |
| Technology | Which services, libraries or models make it feasible, at what cost and limits? |
| Distribution | How does it reach users, and at what cost? |

For non-technical people, skip the technology area unless they ask; record its questions for the target skill instead.

## Intake

The person's material comes first: notes, links, files, past chats, interviews.

1. Read each item and note its date.
2. Extract claims, one per line, tagged with the item.
3. Mark each claim as evidence (observed, measured, cited) or belief (opinion, plan, guess).
4. Classify each claim's volatility and check the high and medium ones.
5. Map each claim to an RQ. Claims with no RQ go to the parking list.

Never discard the person's material. A belief stays a belief until evidence confirms it.

## Gathering

For each RQ without enough evidence:

1. Search the web, or the connected tools when the data is the person's own.
2. Prefer primary sources: official sites, regulators, filings, docs, papers, pricing pages, changelogs.
3. Use at least two independent sources for any claim the verdict depends on.
4. Record each finding as it lands. Do not batch.

A missing number is not evidence. "We measured and it is small" is a finding about the problem. "Nobody measured it" is a finding about instrumentation. When a number is missing, ask the person what they see in support, sales or their own week, and record it as belief.

## Cheaper than building

Before stage 3, ask once what would remove the cost without building the proposed thing: change a default, remove the step, do it by hand for the first ten cases, solve the half that carries most of the cost, or buy it. For buying, check whether a product exists and its current price. Most options are discarded in a line; the one that survives is the most valuable finding of the session.

## Organizing

Write findings to `docs/discovery/findings.md` from `templates/findings.md`.

- One finding per entry, `F-NN`, paraphrased, with source, volatility, status, check date and confidence.
- Group by RQ, strongest evidence first.
- Merge duplicates and keep every source.
- Two findings that disagree get a contradiction `X-NN` with what would settle it. It becomes a grill question.
- Each RQ gets a status: answered, partial, unanswerable (with why).

After each RQ closes, show one line: `RQ-02 answered: 3 findings, 1 outdated claim corrected, 1 contradiction`.

## Exit

Every RQ has a status, every binding finding is current or marked unverifiable, and every contradiction is resolved or carried into the grill.
