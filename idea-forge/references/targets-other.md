# Other targets

Read at stage 5 only when the target is not tlc-spec-lean. The handoff is the same file; only the mapping and the next command change.

Not checked against the live tools yet. Re-check before use.

| Target | Where the handoff goes | Next command |
|---|---|---|
| tlc-spec-driven | spec.md requirements from Intent and Rules; Edges and answered questions to context.md; Flow, Entities and doors to design.md when large or complex. Size maps to its auto-sizing scope | `specify feature <feature> using <handoff>` |
| tlc-plan | Same mapping as tlc-spec-lean | `plan feature <feature> using <handoff>` |
| GitHub Spec Kit | Conventions and constraints to `/speckit.constitution`; Intent, Users, Rules and Success to `/speckit.specify`; answered questions shorten `/speckit.clarify` | `/speckit.specify` with the handoff content |
| Kiro | Rules in EARS to requirements.md; Flow, Entities and doors to design.md | Create the spec from the handoff |
| Other | Read its template, map section by section, list what has no home | Its own start command, with the handoff path |
