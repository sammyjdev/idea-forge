# Dossier: duplicate payment guard
Updated: 2026-11-05

## Verdict
go. Decided by: F-01, F-02.
Evidence: strong

## Problem
Shop owners refund about 3% of card orders because of double charges on retry. Kind: pain. Backed by: F-01.

## Success
Worked if: duplicate refunds fall below 0.1% of card orders within 60 days of release
Early signal: 409 responses appear in logs within the first week
Review: 60 days after release, payments lead

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Key storage fails during a provider outage | low | high | Fall back to provider key only |

## Assumptions
| Assumption | Default | Validate by | Confirmed? |
|---|---|---|---|
| A-01: Customers never legitimately pay the same order twice | Treat a second charge on the same order as a duplicate | Support ticket review | n |

## Open questions
- Q-01: Refund automation for past duplicates [open]

## Candidate features
| Rank | Feature | Goal | Value | Risk | Size |
|---|---|---|---|---|---|
| 1 | duplicate-payment-guard | One charge per order | high | medium | medium |
