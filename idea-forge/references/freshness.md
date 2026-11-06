# Freshness

Read before the first check of a session.

No result may rest on a fact that stopped being true. A claim is any statement the result depends on, whatever its origin: the person ("Stripe charges 2.9% in Brazil"), their material (a 2023 report), a search result (a 2022 blog post) or your own knowledge. Your own knowledge gets no exemption: before stating a time-sensitive fact from memory, search.

## Volatility

| Class | Examples | Search | Check valid for |
|---|---|---|---|
| high | Prices, fees, quotas, versions, model capabilities, API behavior, deprecations, competitors and their features, laws in draft, company status | Always | 30 days |
| medium | Laws and standards in force, market sizes, adoption figures, provider terms, platform policies | Always | 180 days |
| low | Concepts, definitions, history, settled science, math | No | Unlimited |

When unsure, pick the higher class. The window runs from the check date; a source dated before it cannot make a claim current.

The person's first-hand data (their sales, costs, interviews) is not checkable on the web. Record the person as the source and the day they collected it as the check date, set volatility by what it measures, mark it current with confidence 60% or less unless records back it. It is never unverifiable.

## How to check

1. Search with the current year in the query when recency matters.
2. Prefer the primary source: the official site, the regulator, the pricing page, the changelog, the docs. Read the page date; an undated page is weak.
3. For a claim the verdict depends on, find a second independent source. With only one, keep the status and set confidence to 60% or less.
4. When sources disagree, write a contradiction `X-NN` instead of picking one.

## Status

| Status | Meaning | What to show |
|---|---|---|
| current | A dated source within the window confirms it | The claim with its source and date |
| outdated | A current source contradicts it | The old claim, the correction and the source, plainly and without blame: "That was true until March 2026. Current fee: 3.4% (source, date)." |
| unverifiable | No reachable source confirms or denies it | "No verified source found". It cannot decide the verdict alone |

Every checked claim becomes or updates a finding in `docs/discovery/findings.md` with volatility, status and check date, which `scripts/freshness.ts` reads to flag expired checks. On resume, run it and re-check every flagged finding before showing a result that depends on it, verdict findings first.

Without web access, say so once, mark every high and medium claim unverifiable, and keep the verdict at refine until the checks can run.
