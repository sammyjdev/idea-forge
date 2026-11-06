# Handoff: <feature>
Source dossier: docs/discovery/dossier.md
Target: <spec-driven skill>, checked YYYY-MM-DD
Size: <small | medium | large | complex>
Suggested profile: <light | standard | ui>. Reason: <reason>

## Intent
<present tense, no solution: what is true today, who pays, what it costs. Ends with what changes for the user.>

## Flow
1. <step> (exists)
2. <step> (new)

## Entities
| Entity | Relations | Existing data touched |
|---|---|---|
| <entity> | <entity> 1..n <entity> | <table or none> |

## Rules
### S1: <slice name> (P1)
1. WHEN <trigger> THEN the <system> SHALL <response with concrete value, naming the channel when it sends a message>.
   Normal: <input> -> <output>
   Boundary: <neighbouring case: below, above or exactly at the limit> -> <output>

## Edges
| Dimension | Decision |
|---|---|
| Validation | <decision, existing - guard, n/a - reason, or Q-NN> |
| Failure modes | |
| Idempotency | |
| Authorization | |
| Concurrency | |
| Data lifecycle | |
| Dependency failure | |
| State transitions | |
| Observability | |

## Door candidates
1. <choice>. Preferred: <option>. Rejected: <alternative> because <reason>

## Surface hints
- <route or screen>: used by <who>, returns or shows <what>. Or "None - nothing consumed outside"

## Literal text
- <wording the person decided, word for word in the language the user will see, or "None">

## Limits
- <metric>: <target>

## Out of scope
| Capability | Reason |
|---|---|
| <capability> | <reason> |

## Assumptions
| Assumption | Chosen default | Rationale | Validate by | Confirmed? |
|---|---|---|---|---|
| <ambiguity> | <what we will do> | <why> | <how> | n |

## Open questions
- Q-NN: <question> [blocks | blocks go-live | open], or "None"

## Sources
- F-NN: [<title>](<url>), binding | non-binding

## Captures
- <path to a binding design file, or "None">
