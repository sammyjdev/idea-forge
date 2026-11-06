# Research

Read at the start of stage 2. Every check follows `references/freshness.md`. The research questions come from stage 1.

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
3. Use at least two independent sources for any claim the verdict depends on. With one dated source the finding can still be current, but its confidence is at most 60% and the dossier says so.
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
