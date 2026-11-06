# Brief: duplicate payment guard
Position: Stage 5 of 5 · Hand off
Updated: 2026-11-05

## Idea
Shop owners on our checkout refund about 3% of card orders because customers are charged twice when they retry within seconds. Done means one charge per order.

## Context
Problem kind: pain
Focus: technical
Niche: Fintech
Constraints: two engineers, ship in 4 weeks, existing Java checkout service
Target workflow: tlc-spec-lean

## Research questions
- RQ-01: How long does the payment provider retry failed calls? Risk it tests: duplicate window. Status: answered
- RQ-02: Does the provider support idempotency keys? Risk it tests: build vs use. Status: answered

## Decisions
- D-01: Use the provider idempotency key and also store our own key per order. Because: F-02
- D-02: Duplicate window is 24 hours. Because: F-01, F-02
- D-03: A duplicate returns HTTP 409 with the first receipt. Because: grill answer
- D-04: Keys are deleted after 30 days. Because: grill answer

## Assumptions
- A-01: Customers never legitimately pay the same order twice. Validate by: support ticket review. Confirmed? n

## Open questions
- Q-01: Refund automation for past duplicates [open]
