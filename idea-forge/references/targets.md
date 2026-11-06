# Targets

Read at the start of stage 5.

idea-forge writes the same neutral handoff, `docs/discovery/handoff/<feature>.md`, for any spec-driven framework. The target reads it and writes its own files. tlc-spec-lean is the default. Never write inside a target's folders (`.specs/`, `.specify/`, `specs/`, `.kiro/`): the target owns them.

## Pick the target

1. Use the target the person named, or the one already in `brief.md`.
2. Otherwise detect it: `.specs/STATE.md` or `.specs/features/` means tlc-spec-lean unless the person says otherwise; `.specify/` means GitHub Spec Kit; `.kiro/` means Kiro; an installed skill or command with a target's name means that target.
3. No marker: tlc-spec-lean. More than one: ask, with the detected ones as options.

## Check it

Target skills change often: treat their commands, folders and templates as high-volatility claims per `references/freshness.md`. Read the target's current SKILL.md or docs in this session and note its version in the Target line.

- tlc-spec-lean 2.2.0: the handoff fits its plan as is. Give the next command.
- Any other version, or any other target: read `references/target-mapping.md`, map the handoff to the target's current template, and list in the handoff summary what has no home.
- The target cannot be read: say so to the person, keep the mapping as it is, and mark the Target line as unchecked.

## Next command

| Target | Next command |
|---|---|
| tlc-spec-lean | `tlc-spec-lean: plan feature <feature> using docs/discovery/handoff/<feature>.md` |
| tlc-spec-driven | `specify feature <feature> using <handoff>` |
| GitHub Spec Kit | `/speckit.specify` with the handoff content |
| Kiro | Create the spec from the handoff |
| Other | Its own start command, with the handoff path |

When the handoff suggests a verification profile, add one line after the command: "This feature suggests the <profile> verification profile because <reason>; set it where your repo declares one." tlc-spec-lean has no plan field for it.

The target writes its own approval line after the person approves. The handoff never contains one.
