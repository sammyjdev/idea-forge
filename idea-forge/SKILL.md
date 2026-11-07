---
name: idea-forge
description: 'Research and discovery before any spec-driven workflow, for a product or feature idea, a technical question (which approach, is it feasible, should we migrate) or a change to how a team works. Use when someone wants to explore, validate, research or pressure-test one of these before writing a spec or plan, including for that idea whether it is worth building or buying, what competitors ship and charge today, whether the numbers or claims behind it still hold, or what interview notes prove about it. Includes Portuguese requests such as "validar ideia", "vale a pena construir", "pesquisar antes de especificar", "discovery". Checks every time-sensitive fact on the web before showing results, questions the idea one step at a time, and hands off a neutral brief to tlc-spec-lean by default, or to Spec Kit, Kiro and other SDD skills. Do NOT use for writing the spec, plan, tasks or code, or for a feature already decided that only needs planning (use tlc-spec-lean).'
license: CC-BY-4.0
metadata:
  author: github.com/sammyjdev
  version: 1.0.0
---

# idea-forge

The step before any spec-driven workflow, with tlc-spec-lean as the default target. It never writes plans, specs, tasks or code, or anything inside a target's folders: the target owns those.

Conversation follows the person's language. Every file is in English.

## Main rule: verify before you show

Nothing that can change over time reaches the person unchecked: claims from the person, their material or your own knowledge. A stale price, law or API misdirects the whole plan.

Before any turn that presents a result, a recommendation or a finding:
1. List the time-sensitive claims it depends on.
2. Search the web for each one not checked in this session. Never search a person's own record or a claim a search found unverifiable; one unverifiable only for lack of web access is searched when access returns.
3. Mark each as current, outdated (with the correction) or unverifiable.
4. Only then write the turn, and cite what was checked.

Read `references/freshness.md` before the first check of a session.

## Second rule: tables unless asked otherwise

Present research summaries, the dossier and handoff summaries as tables. Do not ask the format; say once, with the first result, that "show me" gives text, a diagram, an illustration or a document instead. This rule wins over any reference that says "ask". Read `references/visuals.md` when the person asks for another format.

## Start

`<skill-dir>` is the folder holding this file. Run scripts from the project root as `node <skill-dir>/scripts/<name>.ts`, or pass `--root <project>`. Run them rather than read them. Without code execution, read only a script's usage header, do its checks by hand, and say once that scripts were not run.

There is no setup and no user profile. On the first turn only, say in one line what happens: facts checked on the web, short question rounds, a verdict, and a file the next step plans from. Name no tool, skill or script in that line. When the first message carries the idea, stage 1 starts: read `references/frame.md` and `references/asking.md`, infer the focus, and state it with the first question, so the person can correct it. Otherwise ask what they want to explore.

Example. "An app for small bakeries in Brazil to take pre-orders by WhatsApp with a Pix deposit" starts stage 1 with two numbered facts (does anyone order this way today, what a no-show costs); the next turn asks alone which prices, fees, limits or rules it counts on; research then checks WhatsApp and Pix pricing before any recommendation.

| Person says | Do |
|---|---|
| start | Begin stage 1 |
| resume | Run `status.ts`, then `freshness.ts`. Re-check what it flags as the main rule says; what is not searched goes to Evidence to collect. Read `references/asking.md`, then continue |
| add this | Take the note, link or file as intake for stage 2 |
| check this | Run a freshness check on the claim and report |
| skip | Record the current question as an assumption, continue |
| how does this work | Summarize `HOW-IT-WORKS.md` in five lines |
| show me | Read `references/visuals.md`, ask the format, show the current topic in it, and keep it |

## Rules

1. Ask only what changes the output, as `references/asking.md` says: up to three facts per turn, each choice alone with a recommendation, everything else an assumption the person corrects with the verdict.
2. Never ask what the person's material, the code, a search or `brief.md` (Facts and Decisions) already answers.
3. Every claim about the world has a source and a check date. No source: "no verified source found".
4. Separate what the person believes from what the evidence shows. Surface contradictions.
5. Match the focus and level: product terms for non-technical people, technical depth for engineers.
6. Unknowns become assumptions or open questions. Never block or wait for someone else's answer: record it as an open question with `Held by:` and carry on to the verdict; the person can resume with it later. Never write a value nobody gave: every concrete value traces to something the person said or accepted, a finding, or an assumption.
7. Short sentences, concrete values, no filler, no em-dash.

## Stages

| Stage | Goal | Read | Exit |
|---|---|---|---|
| 1. Frame | Situation of the subject (a product idea, a technical question, research, a process), what it counts on, idea sentence, problem kind, focus, research questions `RQ-NN` | `references/frame.md`, `references/asking.md`, `templates/brief.md` | When the subject rests on prices, fees, limits, versions or rules, what it counts on is recorded as `K-NN`, from the person's words or one question; sentence, focus and questions stated in one message for the person to correct; research starts without waiting for an "ok". A trivial change gets a one-paragraph answer |
| 2. Research | Take in and check the person's material, gather what is missing, organize findings | `references/research.md` | Every RQ has a status; every binding finding is checked |
| 3. Grill | Confront the idea with the findings, including any journey states, deepest where the focus points | `references/grill.md` | Every item decided, assumed, or a tagged question |
| 4. Synthesize | Verdict (go, refine, not now or stop) with evidence strength, then the dossier: evidence, options, risks, evidence to collect | `references/synthesize.md` | Person accepts the verdict and corrects any assumption in the same answer |
| 5. Hand off | Neutral handoff per feature, target detected and checked, then `validate.ts <feature>` | `references/handoff.md`, `references/targets.md`; `references/target-mapping.md` only when a readable target is not tlc-spec-lean 2.2.0 | Validator passes. Blocking errors return to the stage that fixes them; format errors left after three runs are listed as gaps |

Hand off only on go for something to be built (code, a system, a product change); for any other subject the dossier is the end. Update `docs/discovery/brief.md` at the end of each stage. Before writing any project file, read `references/files.md`. Before long prose, read `references/writing.md`.
