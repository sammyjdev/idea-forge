# Setup

Read when no profile is found or the person says "setup". Target: under 2 minutes.

## First use

1. Explain in five lines:
   ```
   I research your idea and check every fact that can change on the web before showing it.
   Then I question the idea against the evidence, one question at a time, with a recommendation.
   Five stages: frame, research, grill, synthesize, hand off.
   You end with a verdict and a handoff for tlc-spec-lean or another spec-driven skill.
   First, four quick questions so I adapt to you.
   ```
2. Ask four multiple-choice questions in one form (AskUserQuestion when available). This is the only place with more than one question at once. On "setup" with an existing profile, preselect the current values.
   - Who are you: non-technical (founder, business) / product manager / engineer / designer
   - Main focus: business / product / technical / design (preselect the default from `references/focus.md`)
   - How you like results: text / tables / diagram / illustration / document
   - Spec-driven skill you use next: detect from the repository per `references/targets.md` and preselect it; options: tlc-spec-lean (default), tlc-spec-driven, Spec Kit, other
3. Show the resulting profile. After the person confirms, save it:
   ```
   node <skill-dir>/scripts/profile.ts init --role <role> --level <level> --focus <focus> --format <format> --workflow "<target>"
   ```
   Mapping for who are you: non-technical -> `--role founder --level non-technical`; product manager -> `--role PM --level technical`; engineer -> `--role engineer --level technical`, or `--level "senior engineer"` when they say senior; designer -> `--role designer --level technical`. Add `--force` when replacing an existing profile.
4. Ask: "What do you want to explore?", unless the first message already gave the idea. Stage 1 starts.

"skip setup" uses the defaults (engineer, technical, technical focus, tables, tlc-spec-lean), builds the profile from stage 1 answers, and offers to save it at hand off.

## Profile

Holds what is true about the person across projects. Template: `templates/profile.md`.

Lookup order: a path the person gives, `.idea-forge/profile.md` in the project, `~/.config/idea-forge/profile.md`. A project profile wins over the personal one; save it with `--path .idea-forge/profile.md`. In a chat without persistent files, use what the assistant already knows about the person or a pasted profile.

- Skip every question the profile answers.
- Niches, depth and conventions are not asked at setup. Add them when they come up and the person agrees.
- A change for one project goes to `brief.md` under Profile overrides. The profile changes only when the person asks.
- Store only what changes the questions or the outputs. Never store personal or sensitive data.

## How does this work

When asked, print the five lines from step 1. Point to `HOW-IT-WORKS.md` for the full explanation.
