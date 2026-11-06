# Freshness

Read before the first check of a session.

The purpose of idea-forge is that no result rests on a fact that stopped being true. This file says what to check, how, and how to report it.

## What counts as a claim

Any statement the result depends on, from any origin:

| Origin | Example | Why it needs a check |
|---|---|---|
| The person | "Stripe charges 2.9% in Brazil" | People repeat what was true when they last looked |
| Their material | A 2023 market report in their notes | Material ages from the day it was written |
| Your own knowledge | "This library supports streaming" | Training data has a cutoff and does not know what changed |
| A search result | A blog post from 2022 | Search returns old pages next to new ones |

Your own knowledge gets no exemption. When you are about to state a time-sensitive fact from memory, search first.

## Volatility

Classify each claim. The class decides whether to search and how long a check stays valid.

| Class | Examples | Search | Check valid for |
|---|---|---|---|
| high | Prices, fees, quotas, versions, model capabilities, API behavior, deprecations, competitors and their features, laws in draft, funding and company status | Always | 30 days |
| medium | Laws and standards in force, market sizes, adoption figures, provider terms, platform policies | Always | 180 days |
| low | Concepts, definitions, history, settled science, math | No | Unlimited |

When unsure between two classes, pick the higher one.

## How to check

1. Search with the current year in the query when recency matters.
2. Prefer the primary source: the official site, the regulator, the pricing page, the changelog, the docs.
3. Read the page date. An undated page is weak.
4. For a claim the verdict depends on, find a second independent source. With only one, keep the status and set confidence to 60% or less.
5. When sources disagree, write a contradiction `X-NN` instead of picking one silently.

## Status

| Status | Meaning | What to show |
|---|---|---|
| current | A dated primary or secondary source from within the validity window confirms it | The claim with its source and date |
| outdated | A current source contradicts it | The old claim, the correction, the source. Tell the person in one line |
| unverifiable | No reachable source confirms or denies it | Say "no verified source found". It cannot decide the verdict alone |

An outdated claim from the person is reported plainly and without blame: "That was true until March 2026. Current fee: 3.4% (source, date)."

## Recording

Every checked claim becomes or updates a finding in `docs/discovery/findings.md` with volatility, status and check date. `scripts/freshness.ts` reads those fields to flag checks that have expired.

## On resume

Run `node <skill-dir>/scripts/freshness.ts`. Re-check every flagged finding before showing any result that depends on it. Expired checks on findings that decide the verdict come first.

## Without web access

Say once that live checks are not possible in this session. Mark every high and medium claim as unverifiable, and keep the verdict at refine until the checks can run.
