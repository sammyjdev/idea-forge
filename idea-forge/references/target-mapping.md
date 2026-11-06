# Target mapping

Read only when the target's current template differs from this map, or cannot be read. It says where each handoff section lands, so a change in the target shows which sections lose their home.

## tlc-spec-lean

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
| Source tags `[D-NN, K-NN]` | End of each criterion | Kept as written, so a reviewer can trace a value back to `brief.md` or `findings.md` |
| Assumptions | Assumptions | Chosen default and Rationale are required by `validate_plan.py`. `Confirmed? n` unless the person confirmed it. Only a human sets y |
| Open questions | `**Open questions:**` line under Assumptions | Tags `blocks`, `blocks go-live`, `open` carry over |
| Sources | Sources | Each marked binding or non-binding. Here binding means a research finding the verdict rests on |
| Captures | Sources and `captures/` | Binding design files only; tlc-spec-lean treats a capture as the result the user expects |
| Edges | checks.md swept dimensions | Same nine names, so the checks step does not stop to ask |
| Limits | Not in criteria | Service targets go to observability, which tlc-spec-lean excludes from criteria |
| Size small | checks.md with an Intent paragraph only | Under about 3 files and no one-way door |
| Suggested profile | No field in the plan | The repo declares it, for example `profile:` under `## tlc-spec-lean` in `AGENTS.md`. Say it with the next command |

## Other targets

Not checked against the live tools yet.

| Target | Where the handoff goes |
|---|---|
| tlc-spec-driven | Intent and Rules to spec.md; Edges and answered questions to context.md; Flow, Entities and doors to design.md when large or complex |
| GitHub Spec Kit | Constraints to `/speckit.constitution`; Intent, Rules and Success to `/speckit.specify`; answered questions shorten `/speckit.clarify` |
| Kiro | Rules in EARS to requirements.md; Flow, Entities and doors to design.md |
| Other | Read its template, map section by section, list what has no home, the suggested profile included |
