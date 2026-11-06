# Targets

Read at the start of stage 5.

idea-forge always writes the same neutral handoff, `docs/discovery/handoff/<feature>.md`, for any spec-driven framework. The target reads it and writes its own files. tlc-spec-lean is the default.

Never write inside a target's folders (`.specs/`, `.specify/`, `specs/`, `.kiro/`). The target owns them, and its validators expect to create them.

## Pick the target

1. Use the target the person named, or the one already in `brief.md`.
2. Otherwise detect it from the repository:

| Marker | Target |
|---|---|
| `.specs/STATE.md` or `.specs/features/` | a tlc skill. tlc-spec-lean unless the person says otherwise |
| `.specify/` | GitHub Spec Kit |
| `.kiro/` | Kiro |
| an installed skill or command with the target's name | that target |

3. No marker: use tlc-spec-lean. More than one: ask, with the detected ones as options.

## Check the target before mapping

Target skills change often. Treat their commands, folders and templates as high-volatility claims per `references/freshness.md`: read the target's current SKILL.md or docs in this session before giving the next command. When it cannot be read, say so, keep the mapping below, and mark the Target line as unchecked.

## tlc-spec-lean (default)

Checked 2026-11-05 against tlc-spec-lean 2.2.0: its SKILL.md, references/plan.md and scripts/validate_plan.py.

| Handoff section | plan.md section | Notes |
|---|---|---|
| Intent | Problem | Present tense, no solution, who pays, what it costs |
| Flow | Shape numbered path | Steps tagged exists or new. tlc-spec-lean names the modules, adds `(door n)` and the Mermaid diagrams |
| Entities | Shape erDiagram and Changes underneath | Existing data touched becomes Changes underneath |
| Surface hints | Surface | tlc-spec-lean derives route, in, out, statuses and who; the hint must name who uses it. `None - nothing consumed outside` is valid |
| Door candidates | Landing | Literal shape and rejected alternative |
| Rules, by slice | Criteria | Heading `### S1: <name> (P1)`; EARS with `SHALL` and concrete values. Normal and Boundary lines become one `- example → result; strong case → result` line |
| Literal text | Criteria and Assumptions | Copied character for character, never paraphrased |
| Out of scope | Out of scope | With reasons |
| Decisions | Criteria, or Assumptions with `Confirmed? y` | Already decided by the person; the plan does not ask again |
| Assumptions | Assumptions | Chosen default and Rationale are required by `validate_plan.py`. `Confirmed? n` unless the person confirmed it. Only a human sets y |
| Open questions | `**Open questions:**` line under Assumptions | Tags `blocks`, `blocks go-live`, `open` carry over |
| Sources | Sources | Each marked binding or non-binding. Here binding means a research finding the verdict rests on |
| Captures | Sources and `captures/` | Binding design files only; tlc-spec-lean treats a capture as the result the user expects |
| Edges | checks.md swept dimensions | Same nine names, so the checks step does not stop to ask |
| Limits | Not in criteria | Service targets go to observability, which tlc-spec-lean excludes from criteria |
| Size small | checks.md with an Intent paragraph only | Under about 3 files and no one-way door |

Next command:
```
tlc-spec-lean: plan feature <feature> using docs/discovery/handoff/<feature>.md
```

tlc-spec-lean writes the `**Approved**:` line itself after the person approves. The handoff never contains one.

## Other targets

Same file; only the mapping and the next command change. Not checked against the live tools yet, so the check above applies.

| Target | Where the handoff goes | Next command |
|---|---|---|
| tlc-spec-driven | Intent and Rules to spec.md; Edges and answered questions to context.md; Flow, Entities and doors to design.md when large or complex | `specify feature <feature> using <handoff>` |
| GitHub Spec Kit | Constraints to `/speckit.constitution`; Intent, Rules and Success to `/speckit.specify`; answered questions shorten `/speckit.clarify` | `/speckit.specify` with the handoff content |
| Kiro | Rules in EARS to requirements.md; Flow, Entities and doors to design.md | Create the spec from the handoff |
| Other | Read its template, map section by section, list what has no home | Its own start command, with the handoff path |
