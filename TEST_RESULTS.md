# Test Results

Date: 2026-08-17

## Environment

- Python integration tests executed in the provided runtime.
- The validated Agent #2 source package was executed unchanged.
- Node.js, npm, and TypeScript executables are present.
- npm registry/network access did not complete dependency installation within the execution window.

## Inherited engineering package

Command:

```bash
python -m pytest -q tests
```

Result: **55 passed**.

The unchanged Agent #2 engineering suite was re-run after the application integration changes. Collection confirmed 55 tests and the execution completed successfully.

## API, catalog, and report integration

Command:

```bash
python -m pytest -q backend/tests
```

Result: **9 passed**.

Covered:

- source-consistency health behavior;
- NBCC 2020 calculation through the FastAPI adapter;
- warning propagation;
- free report preview;
- report-preview PDF-ready contract completeness;
- preservation of checks, warnings, and validation in report preview;
- fail-closed formal PDF authorization behavior;
- authoritative NBCC 2010 site-class and risk-category catalog values;
- NBCC 2010 locality catalog served from the validated engine dataset;
- edition-separated SFRS catalogs.

## Frontend verification

The frontend now includes:

- structured NBCC 2010, NBCC 2020, and dual-comparison workflows;
- engine-backed catalog selection;
- NBCC 2010 modal response-spectrum input mapping without frontend engineering calculations;
- strict rejection of malformed comma-separated numeric input;
- responsive result rendering;
- safety-critical checks and warnings;
- free report preview;
- typed report-preview API integration.

A dependency-backed production verification was attempted with:

```bash
npm install --no-audit --no-fund
```

The command timed out before dependency installation completed because registry/network access was unavailable in the execution environment.

Frontend production build status: **NOT VERIFIED**.

The repository provides:

```bash
npm run typecheck
npm run build
```

These commands must be executed in an environment with working npm registry access before production sign-off.

## Known limitations

- NBCC 2020 remains blocked from company-approved production engineering release by the Agent #2 engineering handoff.
- Formal PDF rendering/download remains intentionally disabled until approved LinkoTech server-side authentication and report-entitlement integration is supplied.
- The validated Agent #2 wheel remains an immutable external engineering artifact that must be installed unchanged before starting the API.
- No production subdomain is hard-coded or assumed.
- GitHub workflow creation was not available through the current repository token, so no CI workflow was committed during this verification pass.

## Acceptance status

Backend and inherited engineering tests: **PASS**.

Frontend dependency-backed production build: **OPEN**.

Official PDF entitlement integration: **BLOCKED BY MISSING APPROVED EXTERNAL AUTH/ENTITLEMENT CONFIGURATION**.

NBCC 2020 company-approved production engineering release: **BLOCKED BY AGENT #2 HOLD POINTS**.
