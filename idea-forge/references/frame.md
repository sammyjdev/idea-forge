# Frame

Read at the start of stage 1. Stage 1 settles where the effort stands, what kind of problem it is, the focus, and what the research must find out. Write each answer to `brief.md` as it lands.

## Situation

The subject is not always a product. It can be a product or feature idea, a technical question before planning code (which approach, is it feasible, should we migrate), a research question, or a change to how a team works. Read what the person brought and ask only what this subject needs to be framed. No question below is mandatory; pick the ones that would change the research or the verdict, and phrase them in the subject's own terms.

What can matter, depending on the subject:

- Where it stands: something running today that can be measured, nothing yet, or work already in flight.
- Whether the decision is open, or already taken, by whom and when. A taken decision makes the stage 4 verdict a record, not a gate.
- What it touches: systems, people, processes or work in flight.
- What is at stake: how expensive it is to be wrong. Money, health data, personal data, regulation or a change people cannot undo means thorough depth; cheap to undo means quick depth. Infer Depth and record it; never ask for it by name.
- What it counts on: the prices, fees, limits, versions, tools or rules the person believes hold. When the subject rests on any of these, ask once, in a turn of its own (a short list of other questions hides the beliefs that go stale), naming the areas this subject touches: for a product, prices and fees; for a technical question, versions, limits and support; for a process, the rules that bind it. Each answer becomes `K-NN`, and each time-sensitive one becomes a claim stage 2 checks. Skip it only when the person already stated them or the subject rests on nothing that changes over time.

Ask about the subject, never about the person: not their role, their link to the market or their experience. Focus and level are inferred from how they write (see Focus below); a fact about the person matters only when they offer it.

Every concrete fact the person states, in this stage or any later one (volumes, prices, tools they use, what happens today), goes to `## Facts` in `brief.md` as `K-NN` with the message it came from. The handoff cites these IDs.

When it is cheap to undo, touches little, and nobody disagrees with the recommendation, all three at once, give the recommendation in one paragraph and stop. No files.

## Problem kind

| Kind | Meaning | Anchor questions |
|---|---|---|
| Pain | Something happens now and costs something | Who hurts? What does it cost today, in the unit the business feels? What happens if nothing changes? |
| Absence | A capability is missing; nobody is hurt because nobody is doing it | Who cannot do this today? What do they do instead? The substitute is the evidence |
| Construction | The next piece of something still being built | What was this piece promised to enable? What stalls without it? Why now and not after the next piece? |
| Question | An answer is needed before deciding or planning (which option, is it feasible, what does it cost) | What decision waits on the answer? What would each possible answer change? What has been tried or ruled out? |

Never run pain questions on an absence, construction or question kind. "What breaks if we do nothing" answers itself under absence, and the empty answer is not a weak case. Push every abstraction until it has a number or a name: "users are frustrated" means which users, doing what, how often.

## Focus

Infer it from the first messages: the role the person mentions, their vocabulary, what they ask for. State it in one line with the first question ("I will focus on business; say so if you want another"), record it as Focus, and change it whenever the person asks.

| Signal | Focus | Research questions first | Language |
|---|---|---|---|
| Customers, sales, price, market; no technical words | business | Market, competitors, pricing, distribution, regulation | Product terms only |
| Users, problem, roadmap, metrics | product | Problem, users, substitutes | Product terms, technical words explained in one line |
| Stack, API, schema, latency, versions | technical | Technology, regulation that shapes data, existing systems | Technical, versions and limits exact |
| Screens, journeys, flows, usability | design | Users, journeys, substitutes | Product terms only |
| Team, workflow, approvals, how work gets done | process | Current process, people affected, rules that bind it | Plain terms |
| No signal | the focus that fits the subject kind: product for an idea, technical for a technical question, process for a way of working | As that row | As that row |
| Several of the above, or the person asks for all | mixed | One question per area | Product terms, technical words explained in one line |

Every focus still covers the problem sentence, one finding per research question, and the verdict. Focus changes depth, never skips the verdict.

## Research questions

Stage 1 ends with 3 to 8 questions, `RQ-NN`, each tied to a risk of the idea. For each one, write first which answer would change the decision. Data with no decision attached is noise. Say which questions this round does not answer, so research has an end. Pick the areas that fit the subject's kind.

For a product or feature idea:

| Area | Typical question |
|---|---|
| Problem | Does it exist at the stated size? What do people use today? |
| Users | Who has it, who pays, how do they decide? |
| Market | Who solves it already, at what price, with what gaps? |
| Regulation | Which laws, standards or licenses apply where it will run? |
| Technology | Which services, libraries or models make it feasible, at what cost and limits? |
| Distribution | How does it reach users, and at what cost? |

For a technical question: the current system (what runs today, its versions and limits), the alternatives (what each costs and supports), compatibility (what breaks or must change), and migration effort and risk.

For a process change: how it works today, who is affected and how, and the rules that bind it (policy, contract, law).

For a non-technical person, skip the technology area unless they ask; record its questions for the target skill instead.
