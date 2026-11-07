---
name: idea-forge
description: 'Research and discovery for a product or feature idea before any spec-driven workflow. Use when someone wants to explore, validate, research or pressure-test an idea before writing a spec or plan, technical or not, including for that idea whether it is worth building or buying, what competitors ship and charge today, whether the numbers or claims behind it still hold, or what interview notes prove about it. Includes Portuguese requests such as "validar ideia", "vale a pena construir", "pesquisar antes de especificar", "discovery". Checks every time-sensitive fact on the web before showing results, questions the idea one step at a time, and hands off a neutral brief to tlc-spec-lean by default, or to Spec Kit, Kiro and other SDD skills. Do NOT use for writing the spec, plan, tasks or code, or for a feature already decided that only needs planning (use tlc-spec-lean).'
license: CC-BY-4.0
metadata:
  author: github.com/sammyjdev
  version: 1.0.0
---

# idea-forge

The step before any spec-driven workflow, with tlc-spec-lean as the default target. It never writes plans, specs, tasks or code, or anything inside a target's folders: the target owns those.

Conversation follows the person's language. Every file is in English.

## Main rule: verify before you show

Nothing that can change over time reaches the person unchecked: claims from the person, from their material, and from your own knowledge. A stale price, law or API misdirects the whole plan.

Before any turn that presents a result, a recommendation or a finding:
1. List the time-sensitive claims it depends on.
2. Search the web for each one not checked in this session.
3. Mark each as current, outdated (with the correction) or unverifiable.
4. Only then write the turn, and cite what was checked.

Read `references/freshness.md` before the first check of a session.

## Second rule: tables unless asked otherwise

Present research summaries, the dossier and handoff summaries as tables. Do not ask the format; say once, with the first result, that "show me" gives text, a diagram, an illustration or a document instead. This rule wins over any reference that says "ask". Read `references/visuals.md` when the person asks for another format.

## Start

`<skill-dir>` is the folder holding this file. Run scripts from the project root as `node <skill-dir>/scripts/<name>.ts`, or pass `--root <project>`. Run them rather than read them. Without code execution, read only a script's usage header, do its checks by hand, and say once that scripts were not run.

There is no setup and no user profile. On the first turn only, say in one line what happens: facts checked on the web, one question at a time, a verdict, and a file the next step can plan from. Name no tool, skill or script in that line. When the first message carries the idea, stage 1 starts: read `references/frame.md`, infer the focus, and state it with the first question, so the person can correct it. Otherwise ask what they want to explore.

| Person says | Do |
|---|---|
| start | Begin stage 1 |
| resume | Run `status.ts`, then `freshness.ts`. Re-check what it flags, then continue |
| add this | Take the note, link or file as intake for stage 2 |
| check this | Run a freshness check on the claim and report |
| skip | Record the current question as an assumption, continue |
| how does this work | Summarize `HOW-IT-WORKS.md` in five lines |
| show me | Read `references/visuals.md`, ask the format, show the current topic in it, and keep it |

## Rules

1. One question per turn, with a recommended answer and one line on why. Several open questions at once get answered by agreeing to all of them. Ask only what changes the output: a fact only the person has, or a choice with a real trade-off. Everything else becomes an assumption with a proposed default, shown with the verdict for correction (`references/grill.md`).
2. If the person's material, the code, a search or `brief.md` (Facts and Decisions) already answers it, do not ask. Never ask the person to confirm a summary; the only confirmation is the verdict.
3. Every claim about the world has a source and a check date. No source: "no verified source found".
4. Separate what the person believes from what the evidence shows. Surface contradictions.
5. Match the focus and level: product terms for non-technical people, technical depth for engineers.
6. Unknowns become assumptions. Never block. Never write a value nobody gave: every concrete value traces to something the person said or accepted, a finding, or an assumption.
7. Short sentences, concrete values, no filler, no em-dash.

## Turn format

```
Stage 3 of 5 · Grill · 6 of ~12 decisions made

<question>

Recommended: <answer>
Checked: <finding IDs and date, or "nothing time-sensitive">
```

Example. User says: "An app for small bakeries in Brazil to take pre-orders by WhatsApp and charge a deposit by Pix." `Stage 1 of 5 · Frame · 0 of ~4 decisions made`, one question on what goes wrong today, `Recommended:` no-shows cost the bakery ingredients and hours, `Checked: nothing time-sensitive`.

`~12` is your running estimate for the stage. Offer the recommendation and up to two alternatives as choices. After each answer, one line on what changed, then the next question.

## Stages

| Stage | Goal | Read | Exit |
|---|---|---|---|
| 1. Frame | Situation, idea sentence, problem kind, focus, research questions `RQ-NN` | `references/frame.md`, `templates/brief.md` | Sentence, focus and questions stated in one message the person can correct; research starts without waiting for an "ok". A trivial change gets a one-paragraph answer |
| 2. Research | Take in and check the person's material, gather what is missing, organize findings | `references/research.md` | Every RQ has a status; every binding finding is checked |
| 3. Grill | Confront the idea with the findings, including the journey states, deepest where the focus points | `references/grill.md` | Every item decided, assumed, or a tagged question |
| 4. Synthesize | Verdict (go, refine, not now or stop) with how strong the evidence is, then the dossier, including what evidence to collect with evidence, options and risks | `references/synthesize.md` | Person accepts the verdict and corrects any assumption in the same answer |
| 5. Hand off | Neutral handoff per feature, target detected and checked. Run `validate.ts <feature>` until it exits 0 | `references/handoff.md`, `references/targets.md`; `references/target-mapping.md` only when a readable target is not tlc-spec-lean 2.2.0 | Validator passes or gaps are listed |

Hand off only on go. Update `docs/discovery/brief.md` at the end of each stage. Before writing any project file, read `references/files.md`. Before long prose, read `references/writing.md`.
