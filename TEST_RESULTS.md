# Test Results

Date: 2026-08-17

## Environment

- Python integration tests executed in the provided runtime.
- The validated Agent #2 source package was executed unchanged.
- Node.js, npm, and TypeScript executables were present.
- npm registry/network access did not remain available long enough to install frontend dependencies.

## Inherited engineering package

Command:

```bash
python -m pytest -q tests
```

Result: **55 passed**.

The Agent #2 engineering test suite was executed unchanged and passed.

## API and report integration

Command:

```bash
python -m pytest -q backend/tests
```

Result after the report-preview contract changes: **6 passed**.

Covered:

- source-consistency health behavior;
- NBCC 2020 calculation through the FastAPI adapter;
- warning propagation;
- free report preview;
- report-preview PDF-ready contract completeness;
- preservation of checks, warnings, and validation in the preview;
- fail-closed formal PDF authorization behavior.

## Frontend verification

A previous strict TypeScript static verification passed for the structured calculator implementation.

The current report-preview integration was committed after that check. A full dependency-backed production verification could not be completed because `npm install` did not complete in the execution environment.

## Production build status

Frontend production build: **NOT VERIFIED**.

Attempted dependency installation could not complete because npm registry/network access in the execution environment. Therefore the final production-build quality gate remains open.

## Known limitations

- NBCC 2020 remains blocked from company-approved production engineering release by the Agent #2 engineering handoff.
- Formal PDF rendering/download remains intentionally disabled until approved LinkoTech server-side authentication and report-entitlement integration is supplied.
- The validated Agent #2 wheel remains an immutable external engineering artifact that must be installed before starting the API.
- No production subdomain is hard-coded or assumed.
