# Findings

## RQ-01: How long does the payment provider retry failed calls?
Changes the decision if: the retry window exceeds our key retention
Status: answered

### F-01
- Claim: The provider retries a failed charge request for up to 60 seconds
- Origin: search
- Kind: evidence
- Source: [Provider retry docs](https://example.com/docs/retries), page dated 2026-10-01
- Volatility: high
- Freshness: current
- Checked: 2026-11-05
- Quality: primary
- Confidence: 85% | Reason: official docs
- Binding: yes

## RQ-02: Does the provider support idempotency keys?
Changes the decision if: no support means we build all dedup ourselves
Status: answered

### F-02
- Claim: The provider accepts an idempotency key header and keeps keys for 24 hours
- Origin: search
- Kind: evidence
- Source: [Provider idempotency docs](https://example.com/docs/idempotency), page dated 2026-09-15
- Volatility: medium
- Freshness: current
- Checked: 2026-11-05
- Quality: primary
- Confidence: 90% | Reason: official docs
- Binding: yes

## Contradictions

## Parking list
