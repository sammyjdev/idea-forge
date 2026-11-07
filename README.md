# idea-forge

idea-forge is a skill for Claude Code that researches and questions an idea, a technical question or a process change before any spec or plan is written. It checks every fact that can change over time on the web, then hands a neutral handoff file to a spec-driven skill, tlc-spec-lean by default.

## Why

Two things go wrong before a spec. Facts go stale: a fee, a quota, a law or an API limit that was true when someone last looked is no longer true, and the plan is built on it. And ideas stay vague: the spec skill then asks the same questions again, or the builder answers them alone.

idea-forge checks each time-sensitive claim before it shows a result, whether the claim came from you, your notes or the model's own memory. It then questions the idea one decision at a time and writes down what was decided, so the spec skill starts from settled answers.

## Who it is for

| You are | Focus | What you get |
|---|---|---|
| Non-technical founder or business person | business | Market, competitors, prices, distribution and regulation, in product terms. Technical edge cases are asked as outcomes ("a payment arrives twice, what should the customer see?") or recorded as assumptions |
| Product manager | product | Problem, users, substitutes and success criteria |
| Engineer | technical | Feasibility, data, rules, edge cases, exact versions and limits |
| Designer | design | Journeys, states and what each screen must answer |
| Team lead or anyone changing how work gets done | process | How it works today, who is affected and the rules that bind it |

The subject can be a product or feature idea, a technical question (which approach, is it feasible, should we migrate) or a change to how a team works.

There is no setup and no user profile. The focus is read from how you describe the idea, stated with the first question, and changes whenever you ask.

## Quick start

1. Copy the `idea-forge/` folder to `~/.claude/skills/idea-forge/` for all your projects, or to `.claude/skills/idea-forge/` inside one project.
2. Open Claude Code in your project and describe the idea. For example:

   ```
   An app for small bakeries in Brazil to take pre-orders by WhatsApp and charge a deposit by Pix.
   ```

3. idea-forge starts framing the idea at once. It asks only what changes the result: up to three facts per turn, and each choice on its own with a recommended answer. Everything else becomes a proposed default that you see and correct together with the verdict.

## How it works

Five stages, in order:

| Stage | Question it answers | Done when |
|---|---|---|
| 1. Frame | Where does the effort stand, what kind of problem is it, what must we find out? | The idea sentence and research questions are stated; you correct them if needed |
| 2. Research | What does current evidence say? | Every question has a status and every finding the verdict rests on is checked |
| 3. Grill | Does the idea hold against the evidence? | Every decision is made, assumed or recorded as a tagged question |
| 4. Synthesize | What is the verdict, and how strong is the evidence? | You accept the verdict: go, refine, not now or stop |
| 5. Hand off | What does the spec skill need? | `validate.ts` passes, or the format errors it still reports are listed as gaps |

Refine, not now and stop are valid outcomes. Refine means the evidence contradicts part of the idea; missing data never blocks, it becomes a list of what to collect. A handoff is written only on go, and only for something to be built; for a process change or a research question the dossier is the end.

The freshness rule: before any turn that shows a result, idea-forge lists the time-sensitive claims it depends on, searches for each one, and marks it current, outdated with the correction, or unverifiable. Each finding records its volatility and the date it was checked, and the check expires:

| Volatility | Examples | Searched | Check valid for |
|---|---|---|---|
| high | Prices, fees, versions, API behavior, model capabilities, competitors, laws in draft | Always | 30 days |
| medium | Laws in force, market sizes, provider terms, platform policies | Always | 180 days |
| low | Concepts, definitions, history | No | Unlimited |

When you resume, `freshness.ts` lists the expired checks; those with a web source are redone first; a stale record of your own or an unverifiable finding is not searched again and goes to the list of evidence to collect. `validate.ts` blocks the handoff only on a binding finding that current evidence contradicts or that has no volatility set; an expired or unverifiable one is a warning and goes to the list of evidence to collect.

Output formats: results come as tables. Say "show me" to get text, a diagram, an illustration or a document instead; the choice holds for the session. Project files are always markdown, because the spec skill reads them. Only tables and text were exercised in testing.

The full user guide is [idea-forge/HOW-IT-WORKS.md](idea-forge/HOW-IT-WORKS.md).

## Works with

idea-forge always writes the same file, `docs/discovery/handoff/<feature>.md`. The target skill reads it and writes its own files. idea-forge never writes inside a target's folders (`.specs/`, `.specify/`, `specs/`, `.kiro/`).

| Target | Next command | Tested |
|---|---|---|
| tlc-spec-lean (default) | `tlc-spec-lean: plan feature <feature> using docs/discovery/handoff/<feature>.md` | Yes, against tlc-spec-lean 2.2.0. See validation status |
| tlc-spec-driven | `specify feature <feature> using <handoff>` | No |
| GitHub Spec Kit | `/speckit.specify` with the handoff content | No |
| Kiro | Create the spec from the handoff | No |
| Other | Its own start command, with the handoff path | No |

The target is the one you name, or detected from the repository (`.specs/`, `.specify/`, `.kiro/`). Targets change often, so idea-forge reads the target's current instructions in the session before giving the next command, and marks the target as unchecked when it cannot.

## Commands

Say these during a session:

| Say | What happens | Tested |
|---|---|---|
| start | A new session | No |
| resume | Continues from the brief and re-checks expired findings | Yes |
| add this | Adds your note, link or file to the research | No |
| check this | Verifies one claim now | No |
| skip | Records the current question as an assumption | No |
| show me | One visual for the current topic | No |
| how does this work | A five-line summary of HOW-IT-WORKS.md | No |

## Files it writes in a project

| File | Stage | Content |
|---|---|---|
| `docs/discovery/brief.md` | Every stage | Position, idea sentence, research questions, decisions, assumptions, open questions |
| `docs/discovery/intake/` | 2 | Notes or copies of your material, one file per item |
| `docs/discovery/findings.md` | 2 to 4 | Findings with source, volatility, freshness and check date; contradictions; parking list |
| `CONTEXT.md` | 3 | Glossary, one line per term |
| `docs/adr/NNNN-slug.md` | 3 | Only for decisions already made and hard to reverse |
| `docs/discovery/dossier.md` | 4 | Evidence, options, risks, success criteria and the verdict |
| `docs/discovery/handoff/<feature>.md` | 5 | The neutral handoff, one per feature |

## Requirements

- Claude Code with the Skill tool.
- Node 22.18 or later for the scripts, or `npx tsx` on older Node. Tested on Node 24.20 on Windows 11. The scripts have no dependencies.
- Web access (WebSearch and WebFetch). Without it, high and medium claims stay unverifiable, a verdict that rests on one is marked thin, and the unchecked claims are listed to collect. This fallback is documented but was not tested.
- Code execution is optional. Without it, the skill does the script checks by reading and writing files and says so once. Tested in the evals.

## Development

Script tests, from `idea-forge/`:

```
node --test scripts/scripts.test.ts
```

Expected: 141 tests pass. They cover freshness expiry, handoff and dossier validation, the Sources binding check, Entities relations, rules with no channel, the optional verification profile hint, source tags on every rule, boundary, edge and relation, and each script run as a command, including through a linked folder with a space in its path.

Skill structure, with skill-creator installed (its script needs PyYAML):

```
python3 <skill-creator-dir>/scripts/quick_validate.py idea-forge
```

Behavior evals, from `idea-forge/`. Each case runs with and without the skill, and these are billed model runs:

```
claude plugin eval . --allow-tools Write Edit Bash WebSearch WebFetch --scaffold
```

| Case | Checks |
|---|---|
| first-use-starts-framing | No setup form: the first turn asks about the idea and its situation, in the person's language, with no tool names |
| technical-question-adapts | A technical question, not a product: the questions fit it (what runs today, what decision waits on the answer), with nothing about customers, pricing or the person |
| checks-time-sensitive-claim | A claim that can be outdated is searched and reported with source and date before results are shown |
| writes-handoff-for-tlc-spec-lean | A complete handoff is written and validated, nothing under `.specs/features`, no approval line |

Notes:
- On Windows, `plugin eval` refuses a case that grants Bash, because it cannot sandbox the shell there. Run with `--allow-tools Write Edit WebSearch WebFetch --disallow-tools Bash PowerShell`. The skill then uses its no-code-execution fallback, and `05-validator-passes` fails by design.
- checks-time-sensitive-claim depends on what the web says on the day.
- `--case` takes one glob; a second `--case` replaces the first.
- The scaffold scripts set the fixture check dates to the day of the run, so the fixtures do not expire.

Description triggering, with skill-creator, from the skill-creator directory with paths adjusted:

```
python -m scripts.run_loop --eval-set dev/trigger-queries.json --skill-path idea-forge --model <model-id> --max-iterations 5 --num-workers 1 --verbose
```

`dev/trigger-queries.json` holds 12 queries that should trigger the skill and 16 that should not. Two things skew the numbers:
- Run `run_eval` and `run_loop` with `--num-workers 1`. Each worker writes its own copy of the skill into one shared `.claude/commands/` folder, and a run counts only when the model picks its own copy. With 5 workers, a description that fires 7 times in 10 scored close to 0.
- On Windows, skill-creator's `run_eval.py` reads the `claude -p` pipe with `select()`, which works only on sockets there; it needs a reader thread instead.

## Validation status

Run on 2026-11-05, Claude Code 2.1.318, Windows 11, Node 24.20. The end to end and triggering rows were rerun on 2026-11-06.

| Check | Result | Evidence |
|---|---|---|
| Skill structure | Pass | skill-creator `quick_validate.py`: "Skill is valid!"; Tech Leads Club `skill-architect` `validate_skill.py`: 31 of 31 checks, rerun on 2026-11-06 |
| Script tests | Pass | 141 of 141 on 2026-11-07, including each script run as a command, through a junction and from a path with a space |
| Referenced paths | Pass | Every path named in SKILL.md and the references exists |
| Writing rules | Pass | No en-dash or em-dash in any markdown file; SKILL.md body is 998 words (counted after the frontmatter); references are 9 to 90 lines |
| validate.ts on a hand-written handoff | Pass | Passes when complete; fails with a clear message when the slice heading is removed, an approval line is added, an Edges row is empty, a placeholder remains, a rule cites no source or a source that does not exist, or the verdict is refine |
| Eval: first-use-starts-framing | 1.00, without skill 0.67 | 2026-11-07. The first run failed 3 of 3: the skill asked the person's role and link to the market; fixed by asking about the subject, never the person |
| Eval: technical-question-adapts | 0.92, without skill 0.92 | 2026-11-07. A REST-to-gRPC question got technical questions in every run; one run left the progress line in English, fixed after. It guards against product questions on a technical subject rather than separating the arms |
| Eval: checks-time-sensitive-claim | 1.00, without skill 0.83 | The skill corrected an outdated revenue-limit claim from the prompt, citing a source found by web search |
| Eval: writes-handoff-for-tlc-spec-lean | 0.90, without skill 0.17, not rerun | Measured before the grader required the Decisions section. Only `05-validator-passes` failed, because the run had no Bash; its fixture dossier also lacked the unconfirmed A-01, fixed on 2026-11-07. The file checks are deterministic regex graders |
| End to end with tlc-spec-lean 2.2.0 | Pass, with handoff gaps | A simulated non-technical founder accepted a go verdict at answer 21 of 24. `validate.ts` passed the handoff with 5 warnings (rules with no number), and failed it when `Suggested profile` was removed; that field later became optional, a hint the person declares in their repo. tlc-spec-lean wrote a plan that passes `validate_plan.py` with 1 warning, and logged 23 questions: the handoff answered 8 of them, and 15 were genuinely open, one of them a legal question carried rather than asked. The open ones show two gaps `validate.ts` does not catch: rules say "send a message" while the handoff names no channel that can send one, and two Entities rows disagree on how many refunds a Pix can have. tlc-spec-lean also has no place for `Suggested profile` |
| Benchmark against tlc-prd (6 rounds) | Gaps favor idea-forge in every round; effort is the open weakness | Pre-registered rounds, three ideas, Sonnet in every session, the persona in its own session, one run per cell (a signal, not a statistic). Round 6 (2026-11-07, arm B carried over from round 5): a blind auditor found 4 gaps in idea-forge's output against 16 in tlc-prd's; idea-forge corrected 4 of 6 stale beliefs the persona held, tlc-prd 0 (it has no web check); no cell paused for a third party; 1 of 3 ideas reached go (the other two ended at not now and refine, with what to collect); idea-forge took 30 persona messages against 18 (limit 27). Protocol and results in `dev/benchmark-*.md` |
| Description triggering | Pass, 28 of 28 (2026-11-07) | skill-creator trigger eval, 3 runs per query, one worker: 12 of 12 should-trigger queries fire, including a REST to gRPC migration question and a team process change, and 16 of 16 should-not-trigger queries stay silent, including 6 near misses (a price lookup, a free-tier check, an interview summary, a buy-or-host decision, a REST to gRPC migration to implement, a process doc to write). One should-trigger query (resume a discovery and write the handoff) fired 2 of 3 times. The earlier 0 of 10 was a harness artifact: with several workers, each run wrote its own copy of the skill into one shared commands folder, and a run counted only if the model picked its own copy. Results in `dev/trigger-eval-results.json` |

Not tested: the targets other than tlc-spec-lean, the diagram, illustration and document formats, the session commands marked No above, and runs without web access.

## License

[CC-BY-4.0](LICENSE). You may share and adapt this skill, including commercially, if you give credit.
