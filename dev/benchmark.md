# Benchmark: idea-forge against the Tech Leads Club discovery skills

Pre-registered on 2026-11-06, before any run. Thresholds and metrics do not change after the first run; a change is a new benchmark with a new date.

## Question

Does idea-forge add something the TLC catalog does not already do, and does it do the shared part at least as cheaply?

## Arms

| Arm | Flow before the plan | Then |
|---|---|---|
| A. none | The idea sentence only | tlc-spec-lean plan |
| B. tlc-prd | `tlc-prd` interview, `.prd/<slug>.md` | tlc-spec-lean plan from the PRD |
| C. idea-forge | idea-forge stages 1 to 5, `docs/discovery/handoff/<feature>.md` | tlc-spec-lean plan from the handoff |

`tlc-discover` and `tlc-plan` are left out: their technical part overlaps the tlc-spec-lean plan step, which every arm already runs.

## Ideas

Each idea opens with two claims that were true once and are not on the run day. Confirm both on the run day, with source and date, before the first run; replace a claim that turns out current.

| Idea | Persona | Seeded stale claims |
|---|---|---|
| 1. Bakery pre-orders by WhatsApp with a Pix deposit | Non-technical founder, Brazil | A Pix fee, a WhatsApp Business API price |
| 2. Usage-based billing add-on for a B2B SaaS | PM | A payment provider fee, a plan limit of a competitor |
| 3. Internal tool to rotate on-call schedules | Engineer | A free-tier limit of a paging service, a deprecated API version |

Idea 3 is the fair test against idea-forge: little in it depends on time-sensitive facts.

## Method

- One run per arm per idea: 9 runs. Each run is one fresh agent that plays the skill and the persona, with the persona brief fixed per idea and the same for every arm.
- The persona answers from its brief only and says "I don't know" otherwise. It never volunteers a correction to a seeded claim.
- tlc-spec-lean 2.2.0 writes the plan in a fresh session from the arm's output, logs every question it would ask, and nobody answers. `validate_plan.py` runs at the end.
- A second fresh agent, blind to the arm, classifies each logged question as answered by the input, open product, or open plan-phase.

## Metrics

| ID | Metric | Source |
|---|---|---|
| M1 | Open product questions in the tlc-spec-lean plan | Blind classification |
| M2 | Seeded stale claims caught and corrected, out of 2 | Run transcript |
| M3 | Persona messages until the arm's file is written | Run transcript |
| M4 | Words of skill instructions loaded during the run | Files read, counted with `wc -w` |
| M5 | Questions before the first question about the idea, and tool names shown to the persona | Run transcript |
| M6 | `validate_plan.py` exit 0 | Plan run |

## Reading

- New: arm C catches at least 5 of the 6 seeded claims, and arm B catches at most 2.
- More efficient: on the sum over 3 ideas, arm C has M1 at or below arm B, with M3 at most 1.3 times arm B and M4 at or below arm B plus 3,000 words.
- Setup: arm C has M5 equal to 0 questions and 0 tool names on every idea.
- Guard: M6 passes in arms B and C on every idea.

With one run per cell the result is a signal, not a statistic. A difference of 1 or 2 questions on M1 is noise.
