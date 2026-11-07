# Frame

Read at the start of stage 1. Stage 1 settles where the effort stands, what kind of problem it is, the focus, and what the research must find out. Write each answer to `brief.md` as it lands.

## Situation

Five facts, one line each. Ask only what the conversation has not answered.

- Where the effort is: in use (it has a today you can measure), not shipped (no today at all), or under construction (a commitment and work in flight).
- Whether the decision is open, or someone already committed, and who and when. A committed decision makes the stage 4 verdict a record, not a gate.
- What in flight this touches, in one sentence.
- What is at stake: how expensive it is to be wrong. Money, health data, personal data, regulation or a change people cannot undo means thorough depth. Cheap to undo means quick depth. Infer Depth from the answer and record it; never ask for it by name or as a choice.
- What the idea counts on: the prices, fees, limits, tools or rules the person believes hold. Ask once, in their terms: "Which numbers or facts are you counting on, like prices, fees or limits?" Each becomes `K-NN`, and each time-sensitive one becomes a claim stage 2 checks. People rarely volunteer these, and they are what goes stale.

Ask these in the person's own terms: "Is anyone using this today?", not "Where is the effort?".

Every concrete fact the person states, in this stage or any later one (volumes, prices, tools they use, what happens today), goes to `## Facts` in `brief.md` as `K-NN` with the message it came from. The handoff cites these IDs.

When it is cheap to undo, touches little, and nobody disagrees with the recommendation, all three at once, give the recommendation in one paragraph and stop. No files.

## Problem kind

| Kind | Meaning | Anchor questions |
|---|---|---|
| Pain | Something happens now and costs something | Who hurts? What does it cost today, in the unit the business feels? What happens if nothing changes? |
| Absence | A capability is missing; nobody is hurt because nobody is doing it | Who cannot do this today? What do they do instead? The substitute is the evidence |
| Construction | The next piece of something still being built | What was this piece promised to enable? What stalls without it? Why now and not after the next piece? |

Never run pain questions on an absence or construction problem. "What breaks if we do nothing" answers itself under absence, and the empty answer is not a weak case. Push every abstraction until it has a number or a name: "users are frustrated" means which users, doing what, how often.

## Focus

Infer it from the first messages: the role the person mentions, their vocabulary, what they ask for. State it in one line with the first question ("I will focus on business; say so if you want another"), record it as Focus, and change it whenever the person asks.

| Signal | Focus | Research questions first | Language |
|---|---|---|---|
| Customers, sales, price, market; no technical words | business | Market, competitors, pricing, distribution, regulation | Product terms only |
| Users, problem, roadmap, metrics, or no signal | product | Problem, users, substitutes | Product terms, technical words explained in one line |
| Stack, API, schema, latency, versions | technical | Technology, regulation that shapes data, existing systems | Technical, versions and limits exact |
| Screens, journeys, flows, usability | design | Users, journeys, substitutes | Product terms only |
| Several of the above, or the person asks for all | mixed | One question per area | Product terms, technical words explained in one line |

Every focus still covers the problem sentence, one finding per research question, and the verdict. Focus changes depth, never skips the verdict.

## Research questions

Stage 1 ends with 3 to 8 questions, `RQ-NN`, each tied to a risk of the idea. For each one, write first which answer would change the decision. Data with no decision attached is noise. Say which questions this round does not answer, so research has an end.

| Area | Typical question |
|---|---|
| Problem | Does it exist at the stated size? What do people use today? |
| Users | Who has it, who pays, how do they decide? |
| Market | Who solves it already, at what price, with what gaps? |
| Regulation | Which laws, standards or licenses apply where it will run? |
| Technology | Which services, libraries or models make it feasible, at what cost and limits? |
| Distribution | How does it reach users, and at what cost? |

For a non-technical person, skip the technology area unless they ask; record its questions for the target skill instead.
