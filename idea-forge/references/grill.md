# Grill

Read at the start of stage 3.

The grill confronts the idea with the findings. Each question cites the finding behind the recommendation. Open contradictions `X-NN` from stage 2 come first.

## Branches

Walk them in this order and skip what does not apply. A branch is done when its decisions are made or assumed.

| # | Branch | Settle | Quick depth |
|---|---|---|---|
| 1 | Users | Who acts, who pays, who approves | yes |
| 2 | Flow | The main path step by step, where it fails today, and its journey states | yes |
| 3 | Data | What is stored, who owns it, what already exists | no |
| 4 | Rules | Every rule that changes an outcome, with one normal and one boundary example | yes |
| 5 | Edges | Validation, failure, retries and duplicates, permissions, concurrency, data retention, external service down, state changes, logging | no |
| 6 | Limits | Numbers the system must hit: time, volume, cost | no |
| 7 | Out of scope | What will not be built now, and why | yes |

Thorough depth walks every branch. Risky work always gets branch 5. Risky means money, health data, personal data or regulation.

Before closing branch 5, read each edge decision against the rules from branch 4. When two disagree (one says a late payment confirms, another says only a manual confirm does), ask which holds. Each rule also needs its neighbouring cases: below, above and exactly at its limit, and repeated.

In branch 2, walk the states past the happy path: empty, first time, retry, half finished, expired, not allowed, and the person who walks away and comes back tomorrow. Spend real questions on the path that carries most of the volume and a line on the others. For each thing with a status (an order, a payment), ask what happens when each event arrives in each status, including the late ones: a payment after a cancel, a cancel after pickup, undoing a mark. Each confirmed state becomes a rule or a State transitions decision.

Before closing branch 4, close every rule. It names who or what triggers it, what the system does, who learns of it and via which channel ("via WhatsApp", "via the order page"), and for any time limit, when the clock starts and in which time zone. A part the person cannot settle becomes an assumption with a chosen default, never left implicit. Wording and screen content they do not decide (a message's text, what a list shows, where a link goes) become assumptions with a draft default, not open questions. State each data relation once as `A lo..hi B`: each A has lo to hi B.

## Asking

Ask only two kinds of question, one at a time, with a recommended answer and one line on why:

- a fact only the person has (their numbers, their customers, what happens today), when `brief.md` does not already hold it;
- a choice with a real trade-off (two defensible answers with different costs), or any value on a risky path.

Everything else is not asked. An item with one obvious default, an edge case the person is unlikely to know, wording, or a screen detail becomes `A-NN` in `brief.md` with the proposed default, the reason, and `Confirmed? n`. Stage 4 shows every one of them with the verdict, and the person corrects any of them in the same answer; a correction becomes `D-NN`. When the person answers "I don't know", record the recommendation as an assumption and move on; do not ask a follow-up on it.

A rule the person states is a decision: record it as `D-NN` the moment they say it, so the handoff cannot drop it. Never present a proposed default as a fact about their business.

## Using the findings

- Recommend from evidence when it exists and cite the `F-NN`.
- When the person's answer contradicts a finding, say so in one line and ask which holds. Record the outcome.
- When a branch needs a fact no finding covers, check it per `references/freshness.md`, add the finding, then ask. Never recommend from an unchecked time-sensitive fact.
- A belief the person keeps without evidence becomes an assumption with a way to validate it.

## Customization

The focus in `brief.md` sets which branches go deep: business goes deep on users (who pays), limits (cost) and out of scope; product on users, flow, rules and out of scope; technical on data, rules, edges and limits; design on flow, journey states, and edge outcomes as screens; mixed on every branch at thorough depth. The signals below adjust inside it.

| Signal | Effect |
|---|---|
| Role founder or PM | More questions on users, limits and out of scope |
| Role engineer | More questions on data, rules and edges |
| Non-technical | Product terms only. Skip branches 3 and 5 as questions: record recommended defaults as assumptions for the target skill to settle. Risky work still gets branch 5, asked as product outcomes: "a payment is sent twice, what should the customer see?" |
| Precise answer | Next branch, no follow-up |
| Vague answer | A concrete scenario at the edge |
| Risky work | Branch 5 mandatory, boundary example for every rule |

## Niche branches

Add these after branch 4. They also suggest research questions for stage 2.

| Niche | Extra branches |
|---|---|
| B2B SaaS | Tenants and isolation, buyer vs user, SSO, audit trail |
| Fintech | Money movement, licenses, KYC and AML, ledger, duplicate payments |
| Health | Which health data, consent, applicable privacy law, audit |
| AI product | What the model decides, cost of a wrong answer, eval data, cost per call |
| E-commerce | Order lifecycle, stock, payment failure, peak load |
| Regulated documents | Agencies, document types, who signs, retention period |
| Internal tool | Systems of record, approvals, migration from the current tool |
| Mobile | Offline use, store rules, acquisition and retention |
| Data platform | Sources, freshness, consumers, lineage |

For a niche not listed, derive the branches from stage 2 findings and confirm them with the person.

## Glossary

Write each resolved term to `CONTEXT.md` as it resolves. Glossary only, no implementation detail.

## Decisions

Record every decision in `brief.md`. Write an ADR only when the decision is already made and is hard to reverse, surprising without context, and a real trade-off. Most hard-to-reverse choices stay as door candidates for the plan, not ADRs.
