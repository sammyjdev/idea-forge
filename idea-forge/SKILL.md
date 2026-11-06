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

## Second rule: ask the format before a result

Before presenting a research summary, a dossier or a handoff summary, ask "How do you want this?" with the profile format preselected: text, tables, diagram, illustration or document. If the person already chose a format in this conversation, use it without asking again; this rule wins over any reference that says "ask". Read `references/visuals.md` for how to render each.

## Start

`<skill-dir>` is the folder holding this file. Run scripts from the project root as `node <skill-dir>/scripts/<name>.ts`, or pass `--root <project>`. Run them rather than read them. Without code execution, read only a script's usage header, do its checks by hand, and say once that scripts were not run.

Run `node <skill-dir>/scripts/profile.ts check`.
- `missing`: read `references/setup.md` and run first use.
- `stale` or `ok`: in your first message, before any result, show the profile in one line, with the date when stale, and ask "Still right?".

Then read `references/focus.md` and set the focus for this project.

| Person says | Do |
|---|---|
| start | Begin stage 1 with the current profile |
| resume | Run `status.ts`, then `freshness.ts`. Re-check what it flags, then continue |
| setup | Read `references/setup.md` |
| show profile | Run `profile.ts show` |
| add this | Take the note, link or file as intake for stage 2 |
| check this | Run a freshness check on the claim and report |
| skip | Record the current question as an assumption, continue |
| show me | Read `references/visuals.md`, ask the format, show the current topic |

## Rules

1. One question per turn, with a recommended answer and one line on why. Several questions at once get answered by agreeing to all of them.
2. If the profile, the person's material, the code or a search can answer it, do not ask.
3. Every claim about the world has a source and a check date. No source: "no verified source found".
4. Separate what the person believes from what the evidence shows. Surface contradictions.
5. Match the focus and level: product terms for non-technical people, technical depth for engineers.
6. Unknowns become assumptions. Never block.
7. Short sentences, concrete values, no filler, no em-dash.

## Turn format

```
Stage 3 of 5 · Grill · 6 of ~12 decisions made

<question>

Recommended: <answer>
Checked: <finding IDs and date, or "nothing time-sensitive">
```

Example. User says: "An app for small bakeries in Brazil to take pre-orders by WhatsApp and charge a deposit by Pix." After setup: `Stage 1 of 5 · Frame · 0 of ~4 decisions made`, one question on what goes wrong today, `Recommended:` no-shows cost the bakery ingredients and hours, `Checked: nothing time-sensitive`.

`~12` is your running estimate for the stage. Offer the recommendation and up to two alternatives as choices. After each answer, one line on what changed, then the next question.

## Stages

| Stage | Goal | Read | Exit |
|---|---|---|---|
| 1. Frame | Idea sentence, problem kind, focus, research questions `RQ-NN` | `references/focus.md`, `templates/brief.md` | Person confirms sentence, focus and questions |
| 2. Research | Take in and check the person's material, gather what is missing, organize findings | `references/research.md` | Every RQ has a status; every binding finding is checked |
| 3. Grill | Confront the idea with the findings, deepest where the focus points | `references/grill.md` | Every item decided, assumed, or a tagged question |
| 4. Synthesize | Dossier with evidence, options, risks and a verdict: go, refine or stop | `references/handoff.md` | Person accepts the verdict |
| 5. Hand off | Neutral handoff per feature, target detected and checked. Run `validate.ts <feature>` until it exits 0 | `references/handoff.md`, `references/targets.md` | Validator passes or gaps are listed |

Hand off only on go. Update `docs/discovery/brief.md` at the end of each stage. Before writing any project file, read `references/files.md`. Before long prose, read `references/writing.md`.
