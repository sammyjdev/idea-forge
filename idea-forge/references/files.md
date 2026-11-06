# Files

Read before writing any project file. Create a file only when there is something to write in it.

| File | Template | Stage | Content |
|---|---|---|---|
| `~/.config/idea-forge/profile.md` | `templates/profile.md` | Setup | Person profile, across projects. Written by `scripts/profile.ts init` |
| `.idea-forge/profile.md` | `templates/profile.md` | Setup | Optional project profile. Wins over the personal one |
| `docs/discovery/brief.md` | `templates/brief.md` | 1, every stage | Position line, idea sentence, RQs, overrides, decisions, assumptions, open questions |
| `docs/discovery/intake/` | none | 2 | Copies or notes of the person's material, one file per item |
| `docs/discovery/findings.md` | `templates/findings.md` | 2, 3, 4 | Findings `F-NN` with volatility, freshness and check date, contradictions `X-NN`, parking list. `scripts/freshness.ts` reads it |
| `CONTEXT.md` | none | 3 | Glossary. One line per term: `Term: meaning. Not: <confused term>` |
| `docs/adr/NNNN-slug.md` | `templates/adr.md` | 3 | Only for decisions already made and hard to reverse. Profile ADR convention overrides the template |
| `docs/discovery/dossier.md` | `templates/dossier.md` | 4 | The single document that explains the idea and the verdict |
| `docs/discovery/handoff/<feature>.md` | `templates/handoff.md` | 5 | Neutral handoff, one per feature. Target folders are never written |

Keep the `Position:` line in `brief.md` current. `scripts/status.ts` reads it to resume.

ADR numbering is per repository: next number after the highest in `docs/adr/`.

In durable files, describe what is, not what changed.
