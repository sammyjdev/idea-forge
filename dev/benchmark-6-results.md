# Benchmark 6 results (run 2026-11-07)

Bench folder C:/tmp/idea-forge-bench6. idea-forge at 3065cb0 (detached worktree). Method as benchmark 5 (prompts/converse.py, run.py; two sessions per discovery with --resume; persona session Read only; MAXP 30; web calls inserted into the auditor's transcripts; one blind audit). All sessions claude -p, model sonnet (claude-sonnet-5-5), at most 3 at once. Only arm C was run; the three benchmark 5 B cells were copied (runs/1-B, 2-B, 3-B) and re-audited with new codes.

## Cells

M1 = open product questions (classification). G = gap, U = unsupported stated as fact (blind audit of this run, both arms). M3 = persona messages until the output file exists. M2 strict / loose of 2 per idea.

| Cell | M1 | G | U | M2 strict / loose | M3 | Setup | Verdict | Evidence | Items to collect real/total | validate.ts | validate_plan.py |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1-B (B5 cell) | 10 | 11 | 5 | 0 / 0 | 6 | n/a | PRD written | n/a | n/a | n/a | exit 0 |
| 2-B (B5 cell) | 7 | 5 | 2 | 0 / 0 | 6 | n/a | PRD written | n/a | n/a | n/a | exit 0 |
| 3-B (B5 cell) | 5 | 0 | 2 | 0 / 0 | 6 | n/a | PRD written | n/a | n/a | n/a | exit 0 |
| 1-C | 4 | 1 | 5 | 2 / 2 | 8 | 0 q, 0 tool names | not now (dossier) | thin | not judged (not a go) | not run (no handoff) | exit 0 |
| 2-C | 2 | 0 | 2 | 2 / 2 | 11 | 0, 0 | refine (dossier) | thin | not judged (not a go) | not run (no handoff) | exit 0 |
| 3-C | 6 | 3 | 5 | 0 / 2 | 11 | 0, 0 | go (two features), handoffs | thin | 4 / 4 (Q-03 weak) | pass, exit 0 on both handoffs, 0 warnings | exit 0 |

Blind codes: 4L=1-B, 9X=2-B, 6Q=3-B, 3R=1-C, 2F=2-C, 8V=3-C. B M1 and M3 are benchmark 5's (M1 10/7/5, M3 6/6/6); B G and U are from this audit (the benchmark 5 audit gave G 11/5/2 and U 3/0/1 for the same three cells).

3-C produced two handoffs (weekly-schedule-sync, friday-schedule-post). run.py find_input takes the first sorted one, so plan, classification and the blind audit used friday-schedule-post.md. M1 6 and the audited G 3 and U 5 for 3-C describe the smaller Friday-post feature, not the sync job. validate.ts was run on both handoffs.

## Sums

| Arm | M1 | G | U | M2 strict / loose (of 6) | M3 | Web calls |
|---|---|---|---|---|---|---|
| B | 22 | 16 | 9 | 0 / 0 | 18 | 0 |
| C | 12 | 4 | 12 | 4 / 6 | 30 | 15 searches, 9 fetches (1-C 6+3, 2-C 2+2, 3-C 7+4) |

## Seeded beliefs voiced and corrected

| Cell | Belief | Voiced | Corrected | Strict | Loose |
|---|---|---|---|---|---|
| 1-C | WhatsApp priced per 24 h conversation | P-03 (M-05) | A-03 (M-06): per business-sent message since 2025-07-01, Meta pricing page linked | yes | yes |
| 1-C | Pix cannot charge on a schedule | P-03 (M-05) | A-03 (M-06): "in part outdated", Pix Automatico exists (Meu Tudo, Correio Braziliense; not an official page), judged irrelevant to a single deposit | yes | yes |
| 2-C | Stripe Billing 0.5% | P-03 (M-05) | A-03 (M-06): 0.7%, stripe.com/billing/pricing | yes | yes |
| 2-C | Orb free plan up to 250 invoices | P-03 (M-05) | A-03 (M-06): no free plan listed, credit based, withorb.com/pricing; persona accepted at P-04 | yes | yes |
| 3-C | Opsgenie open for new customers | never voiced (P-03 said only "a paging service the company already pays for") | Surfaced by the skill at A-03 (M-06): end of sale 2025-06-04, off 2027-04-05, Atlassian page; persona took it as new information at P-04 | no | yes |
| 3-C | Slack files.upload | never voiced | Surfaced by the skill at A-11 (M-22), after the persona asked for the Friday post: files.upload retired, two-call upload flow, written into the handoff | no | yes |

New (strict): 4 of 6 (benchmark 4: 5, benchmark 5: 2). Both misses are in 3-C, where the persona never voiced a belief: its brief gives them only "when relevant", and the areas asked about never led it to name a paging tool or a file upload.

## Beliefs question turns (exact text, A-02 of each cell)

### 1-C (M-04)

```
Anotado. Pelos seus números, são cerca de 6 a 7 encomendas perdidas por semana. Isso dá uns R$ 600 de ingrediente e 20 horas de trabalho por semana jogados fora, e no Natal o prejuízo é maior.

Etapa 1 de 5 · Enquadramento · 1 de ~4 decisões tomadas

Com que preços, taxas, limites ou regras essa ideia está contando? Por exemplo:
- quanto custa receber Pix e quanto custa usar o WhatsApp para atender (taxa por transação ou mensalidade);
- qual percentual de sinal você imagina cobrar (e se devolve ou não em caso de cancelamento);
- regras que você acha que valem, como prazo para cancelar ou política de reembolso.

Pode ser só o que você imagina hoje, mesmo sem certeza. Eu confiro tudo na web depois.

Checked: nada sensível ao tempo por enquanto
```

### 2-C (M-04)

```
Stage 1 of 5 · Frame · 1 of ~4 decisions made

Noted: the overage units are SMS and route-optimisation API calls. Finance estimates about $38k a year in excess cost, unaudited. About 30 of roughly 200 customers (15%) use 5x or more of the median volume. Billing is flat Stripe subscriptions with no known overage charge. I'll record the unknowns (cost per unit, average overage, what happens today) as assumptions and open questions.

Which prices, fees, limits or rules does this idea count on being true? For example:

- Stripe's usage-based billing pricing and its metering limits
- The SMS carrier or provider's per-message price
- The route-optimisation provider's price per call
- Tax or invoicing rules for variable charges where your customers are
- Contract terms that promise a plan's volume

List whatever you believe holds today, even if you're unsure. I'll check each one on the web.

Checked: nothing time-sensitive
```

### 3-C (M-04)

```
Noted: 8 engineers, weekly rotation, breaks every 2 to 3 weeks, and 2 incidents with nobody paged last quarter. The sheet and the paging tool disagreed on who was primary.

Stage 1 of 5 · Frame · 1 of ~4 decisions made

What does the idea count on holding true? Please list what applies, even if you're not sure:

- The paging tool: which one it is, its plan and price, and whether you believe it has an API or built-in schedule features.
- Where leave and holidays are recorded (HR system, shared calendar), and whether the tool could read them.
- Any rules on on-call: fairness limits, rest after a shift, pay or time off for on-call, or local labor rules.
- Any budget or time limit for building this.

Checked: nothing time-sensitive
```

In all three cells the beliefs question is alone in its turn (the turn holds only the acknowledgement of the previous answer, the question with example areas, and the Checked line). The example areas fit the subject kind: Pix and WhatsApp costs and refund rules for the bakery; Stripe, SMS and route-optimisation prices, tax rules and contract terms for the billing add-on; paging tool, HR leave source, on-call rules and budget for the on-call tool. In 3-C the areas did not include an API or service to post files, which is consistent with Slack files.upload never being voiced.

## Pause for a third party

| Cell | Paused waiting for someone else? | Evidence |
|---|---|---|
| 1-C | No | Asked one fact only the person holds (is 1 in 6 from a record) and got an answer. The Inter fee table went to the dossier's Evidence to collect; "resume" offered after the 4-week test. |
| 2-C | No | A-03: "I can't answer those from the web, so I'm recording them as open questions for you to hand to finance, legal or sales. I'll carry on without waiting for them." Held-by items (Marcus approves pricing, contracts, SMS costs) became open questions; A-06 "It blocks going live, not the pilot design". |
| 3-C | No | A-03: "I'm not waiting on them. Say 'resume' when you have them." Q-01 to Q-07 (tool name, HR export, sheet layout held by Ines, job host) were recorded with Held by and the skill went on to a go verdict. |

Benchmark 5's stall (3-C, 30 messages waiting for Ines) did not recur.

## Reading, as pre-registered

| Line | Result | Numbers |
|---|---|---|
| New (C at least 4 of 6 strict) | PASS | C 4 strict (6 loose) |
| No stall (every C cell reaches a verdict before the cap) | PASS | 1-C 8, 2-C 11, 3-C 11 persona messages, all status done |
| Gaps (C at least 3 fewer than B, both this audit) | PASS | C 4 (1-C 1, 2-C 0, 3-C 3), B 16 (1-B 11, 2-B 5, 3-B 0); difference 12 |
| Unsupported (C at most B + 3) | PASS | C 12, B 9, limit 12 (exactly at the limit) |
| Effort (C persona messages at most 1.5 x B's 6 per idea) | FAIL | C 30, B 18, limit 27 |
| Hand off (at least 2 of 3 C reach go and pass validate.ts) | FAIL | 1 of 3: 3-C go, validate.ts exit 0 on both handoffs; 1-C not now; 2-C refine |
| Thin is honest (every C go with Evidence: thin lists at least one real item; auditor saw the dossier) | PASS | 3-C (8V): 4 of 4 real (Q-03 rated "real (weak)"); the only C go |
| Setup (0 questions, 0 tool names before the first idea question) | PASS | A-01 of all three cells names no tool and is the one-line summary plus the idea questions |
| Guard (validate_plan.py exit 0 in every C cell with a plan input) | PASS | 3 of 3 exit 0 (0 errors, 0 warnings) |

## Decision rule as written

- New, No stall and Gaps all pass: open the pull request with the benchmark result files as evidence, and draft the Tech Leads Club comment for the owner to approve before posting.
- No stall, New and Gaps do not fail, so the other branches do not apply.
- Effort and Hand off fail on their own: listed as known weaknesses in the pull request, measured in a later benchmark; they do not hold it back. Unsupported passes with zero margin (12 vs limit 12).

Outcome: open the PR and draft the TLC comment for the owner. Neither was done here (nothing was committed or posted).

## Thin is honest detail (3-C)

Dossier "Evidence to collect", auditor's judgment (folder 8V): Q-01 paging tool name, plan, price: real (decides whether an API exists, changes A-05 and the top risk). Q-02 HR export of leave: real (keeps or drops the leave list). Q-03 rest, pay, time-off rules: real, weak (impact deferred). Q-07 the two unpaged incident records: real (moves evidence from thin to strong). The auditor also noted that Q-04, Q-05 and Q-06, tagged as blocking go-live, appear in Open questions and not in Evidence to collect.

## Per-cell verdicts

- 1-C: not now (build), thin evidence. Recommended a 4-week manual test with a notebook column for the cancellation time. 8 persona messages (B5: 7). M1 4 (B5: 2).
- 2-C: refine, thin evidence. Manual pilot with written notice and 30 days. 11 persona messages (B5: 15). M1 2 (B5: 10). Both stale beliefs corrected. No handoff, so validate.ts was correctly not run.
- 3-C: go, thin evidence, on a smaller proposal (hourly sheet-to-paging-tool sync instead of a rotation generator), plus a second feature, the Friday post. 11 persona messages (B5: stalled at the 30 cap). Both handoffs validate.

## Deviations and caveats

1. audit_r5.tmpl was edited in the bench6 copy: "five" became "six", a sentence says some folders also hold dossier.md, and Task C takes the Evidence line and items from dossier.md when present. build_blind.py was edited to copy a scrubbed dossier.md into each C folder and to use new codes (seed 66). Nothing else in the rubric changed.
2. 3-C had two handoffs; only the first sorted (friday-schedule-post) fed plan, classification and the audit. The audited G, M1 and U for 3-C describe the smaller feature; the sync handoff, the main feature, was not audited.
3. For 1-C and 2-C (no handoff) the plan input is the dossier, so the auditor saw the same text as input.md and dossier.md.
4. The persona states beliefs only when relevant; 3-C's persona never voiced either, so strict credit was impossible there. Strict is reported as defined (voiced and corrected).
5. M2 strict for 1-C Pix counts although the correction cites third-party news pages, not Banco Central, and says it does not change the plan.
6. Web call counts come from tools-used.json (WebSearch and WebFetch tool uses in the skill sessions). M4 was not part of the benchmark 6 reading and is not reported.
7. 1-B, 2-B and 3-B were not rerun: copied from benchmark 5. Their M1 and M3 are benchmark 5's; G and U come from this audit.
8. No cell crashed, no usage limit was hit, no reruns.
9. Sessions were told today is 2026-11-07; claims.md keeps its 2026-11-06 check date and was not rechecked.

## Surprises

- 3-C reached a go with two handoffs, the second a feature the persona raised after accepting the verdict (the Friday post). The skill split it into its own feature instead of widening the first.
- 3-C attached "Evidence: thin" to a go, with the dossier calling the list advice and not a condition, and left three go-live blockers (Q-04, Q-05, Q-06) out of Evidence to collect (auditor note).
- U sits exactly at the limit (12 vs 12), driven by 1-C (5) and 3-C (5): items such as notebook columns, fee-table steps and assistant judgments the persona never saw. 3-C's handoff also carries 8 assumption-marked items the persona did not see.
- Effort fails by 3 messages (30 vs 27); the cost is mostly 2-C (11) and 3-C (11), each walking several grill decisions.
- The B reference held: 1-B 11 gaps (audit B5: 11), 2-B 5 (5), 3-B 0 (2).
