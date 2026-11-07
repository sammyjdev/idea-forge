# Freshness

Read before the first check of a session.

No result may rest on a fact that stopped being true. A claim is any statement the result depends on, whatever its origin: the person ("Stripe charges 2.9% in Brazil"), their material (a 2023 report), a search result (a 2022 blog post) or your own knowledge. Your own knowledge gets no exemption: before stating a time-sensitive fact from memory, search.

## Volatility

| Class | Examples | Search | Check valid for |
|---|---|---|---|
| high | Prices, fees, quotas, versions, model capabilities, API behavior, deprecations, competitors and their features, laws in draft, funding and company status | Always | 30 days |
| medium | Laws and standards in force, market sizes, adoption figures, provider terms, platform policies | Always | 180 days |
| low | Concepts, definitions, history, settled science, math | No | Unlimited |

When unsure, pick the higher class. The window runs from the check date; a source dated before it cannot make a claim current.

The person's first-hand data is not checkable on the web. Two kinds:

- A record they keep and can name: an order notebook, a spreadsheet, a bank statement, interview notes. It is a finding: the record and the period it covers as the source, the last date it covers as `Checked: YYYY-MM-DD`, volatility by what it measures, status current, confidence 60% or less unless the record was read in this session. It is never unverifiable. Its check expires like any other, but it is never searched on the web: once flagged, the newer record goes under Evidence to collect.
- A figure from memory or an estimate ("about 1 in 6 do not show up"). It is a `K-NN` fact the person stated, not a finding; when the verdict depends on it, ask once whether a record backs it and write the answer on the `K-NN` line (`Record: none`, or the record's name), so it is never asked again; when one does, record that record as the finding.

## How to check

1. Search with the current year in the query when recency matters.
2. Prefer the primary source: the official site, the regulator, the pricing page, the changelog, the docs. Read the page date; an undated page is weak.
3. For a claim the verdict depends on, find a second independent source. With only one, keep the status and set confidence to 60% or less.
4. When sources disagree, write a contradiction `X-NN` instead of picking one.

## Status

| Status | Meaning | What to show |
|---|---|---|
| current | A dated source within the window confirms it | The claim with its source and date |
| outdated | A current source contradicts it | The old claim, the correction and the source. Tell the person in one line, plainly and without blame: "That was true until March 2026. Current fee: 3.4% (source, date)." |
| unverifiable | No reachable source confirms or denies it | "No verified source found". It cannot decide the verdict alone |

Every checked claim becomes or updates a finding in `docs/discovery/findings.md` with volatility, status and check date, which `scripts/freshness.ts` reads to flag expired checks. On resume, run `node <skill-dir>/scripts/freshness.ts` and re-check on the web every flagged finding whose source is on the web before showing a result that depends on it, verdict findings first. A flagged finding whose source is the person's record, or that a web search found unverifiable, is not searched again: list under Evidence to collect the newer record or the check that would settle it, and count the evidence as thin when the verdict rests on it (`references/synthesize.md` defines strong and thin). A finding unverifiable only because the session had no web access is searched once web access returns.

Without web access, say so once and mark every web-checkable high and medium claim unverifiable, written as `- Freshness: unverifiable (no web access)` so a later session with web access searches it; a person's record stays current within its window and is never marked unverifiable. Judge the evidence as strong or thin by the one definition in `references/synthesize.md`: a verdict resting on an unverifiable claim is thin. List each unchecked claim under Evidence to collect.
