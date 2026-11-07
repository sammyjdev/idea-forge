# How idea-forge works

idea-forge is the research and discovery step before a spec-driven skill. tlc-spec-lean is the default target; tlc-spec-driven, GitHub Spec Kit, Kiro and others work through the same handoff. It works for technical and non-technical people.

Its main job: no result reaches you on a fact that stopped being true. Every claim that can change over time, whether it came from you, your notes or the assistant's own knowledge, is checked on the web before it is shown.

It does not write plans, specs, tasks or code, and never writes inside a target's folders. The target skill starts where idea-forge stops.

## What you get

- Findings, each with a source, a check date and a status: current, outdated with the correction, or unverifiable.
- Your own claims checked, and corrected plainly when they are out of date.
- Contradictions between sources, or between beliefs and evidence, named and settled.
- A glossary (`CONTEXT.md`) where every term has one meaning.
- A dossier with evidence, options, risks, success criteria and a verdict: go, refine, not now or stop. Missing evidence does not block: it becomes a list of what to collect.
- On go, one handoff per feature, sized and ready for the target skill.

## Verify before you show

| Volatility | Examples | Searched | Check valid for |
|---|---|---|---|
| high | Prices, fees, versions, API behavior, model capabilities, competitors, laws in draft | Always | 30 days |
| medium | Laws in force, market sizes, provider terms, platform policies | Always | 180 days |
| low | Concepts, definitions, history | No | Unlimited |

When you resume a session, `freshness.ts` lists the checks that expired; those with a web source are redone before anything that depends on them is shown, and a stale record of your own goes to the list of evidence to collect. The handoff is blocked only while a binding finding is outdated, that is, contradicted by current evidence. An expired or unverifiable one is a warning and goes to the list of evidence to collect.

## The five stages

| Stage | Question it answers | Done when |
|---|---|---|
| 1. Frame | What is the idea, what kind of problem, what must we find out? | The idea sentence and research questions are stated; you correct them if needed |
| 2. Research | What does current evidence say? | Every question has a status and every binding finding is checked |
| 3. Grill | Does the idea hold against the evidence? | Every branch is decided, assumed or a tagged question |
| 4. Synthesize | What is the verdict, and how strong is the evidence? | You accept the verdict |
| 5. Hand off | What does the target skill need? | `validate.ts` passes |

Refine, not now and stop are valid outcomes. Refine means the evidence contradicts part of the idea, not that data is missing. Hand off happens only on go, and only for something to be built; for a process change or a research question the dossier is the end.

## A turn

```
Stage 3 of 5 · Grill · 6 of ~12 decisions made

What should happen when a customer pays twice for the same order within 10 seconds?

Recommended: reject the second payment and show the first receipt
Checked: F-07, provider retries failed calls for up to 60 s (docs, 2026-11-05)
```

Pick the recommendation, an alternative, or type your own answer. A choice like this comes alone. Facts only you have come up to three at once, numbered, with no recommendation:

```
Stage 1 of 5 · Frame · 1 of ~4 decisions made

1. How many orders a week do you take today?
2. How many of them are never picked up?
3. How do customers place an order today?
```

## Focus

There is no setup. The focus is read from how you describe the idea and stated with the first question, so you can correct it in one word.

| How you write | Focus | Goes deep on |
|---|---|---|
| Customers, sales, price, market | business | Market, competitors, pricing, distribution, regulation |
| Users, problem, metrics | product | Problem, users, substitutes, success criteria |
| Stack, APIs, versions, limits | technical | Feasibility, data, rules, edge cases, current versions and limits |
| Screens and journeys | design | Journeys, states, what each screen must answer |
| Several of these | mixed | Every area, at thorough depth |

The focus changes depth and language. Every focus still ends with evidence and a verdict. You can change it at any time.

## Tables unless you ask

Results come as tables, without a question. Say "show me" to get text, a diagram, an illustration or a document instead; the choice holds for the session. Diagrams use standard notation (BPMN, UML, C4); illustrations are flat drawings for people who read pictures faster than notation. Project files stay markdown, because the target skill reads them.

## Your own material

Say "add this" with notes, links or files. Each item is read, dated, split into claims, marked as evidence or belief, and checked. Nothing is discarded; claims that fit no research question go to a parking list. Say "check this" to verify a single claim.

## Commands

| Say | What happens |
|---|---|
| start | New session |
| resume | Continues from the brief and re-checks expired findings |
| add this | Adds your note, link or file to the research |
| check this | Verifies one claim now |
| skip | Records the current question as an assumption |
| show me | One visual for the current topic |
| how does this work | A five-line summary of this guide |

## Handoff targets

The handoff is one neutral file, `docs/discovery/handoff/<feature>.md`. The target is detected from your repository (`.specs/`, `.specify/`, `.kiro/`) or named by you; with neither, it is tlc-spec-lean. Its current template is checked in the session before the next command is given, because these tools change often.

| Target | Next step |
|---|---|
| tlc-spec-lean (default) | `tlc-spec-lean: plan feature <feature> using <handoff>` |
| tlc-spec-driven | `specify feature <feature> using <handoff>` |
| GitHub Spec Kit | `/speckit.specify` with the handoff, then `/speckit.clarify` |
| Kiro | Create the spec from the handoff |
| Other | Its start command, with the handoff path |

## Package

```
idea-forge/
  SKILL.md              core loop, always loaded
  HOW-IT-WORKS.md       this file
  references/           read only when the step needs them
    freshness.md        what to check, how, statuses, before the first check
    frame.md            situation, problem kind, focus, research questions, at stage 1
    asking.md           what to ask, what to assume, the turn format, from stage 1
    targets.md          pick and check the target, next command, at stage 5
    target-mapping.md   where each handoff section lands, only when a readable target is not tlc-spec-lean 2.2.0
    research.md         intake, gathering, cheaper than building, at stage 2
    grill.md            branches, journey states, niches, at stage 3
    synthesize.md       verdict and dossier, at stage 4
    handoff.md          handoff and EARS, at stage 5
    files.md            project files, before writing one
    visuals.md          output formats, when you ask for another one
    writing.md          before long prose
  templates/            brief, findings, dossier, handoff, ADR
  scripts/
    status.ts           position and open items
    freshness.ts        expired, outdated and unverifiable findings
    validate.ts         handoff, verdict, source tag and freshness gate
```

Scripts are TypeScript with no dependencies. They run from the project root with Node 22.18 or later (`node <skill-dir>/scripts/<name>.ts`), or `npx tsx` on older Node. Without code execution, the same steps are done by reading and writing files.

## Limits

- Checks depend on reachable sources. Without web access, high and medium claims stay unverifiable, the evidence is marked thin and the unchecked claims go to the list of what to collect.
- The tlc-spec-lean mapping was checked on 2026-11-05 against tlc-spec-lean 2.2.0. The other targets have not been checked against the live tools. Each session re-checks the target before giving the next command. If a target asks for something missing, add it to the handoff and rerun `validate.ts`.
