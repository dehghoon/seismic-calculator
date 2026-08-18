# Test Results

Date: 2026-08-17

## Inherited engineering package

The supplied Agent #2 package reports 55/55 tests passed, complete formula traceability for `F-001..F-062` and `N20-F-001..N20-F-045`, and successful single/dual examples. This repository does not modify the engine.

## Integration verification

Backend adapter tests cover health/source consistency, NBCC 2020 calculation output, free report preview safety data, and fail-closed formal PDF access.

## Known limitations

- NBCC 2020 production release remains blocked by the engineering handoff.
- Formal PDF rendering/authentication/subscription integration is not enabled because no approved LinkoTech auth/entitlement configuration was supplied.
- Frontend production build must be run in an environment with npm registry access.
