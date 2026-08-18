# Test Results

Date: 2026-08-17

## Environment

- Python integration tests executed in the provided runtime.
- Node.js and TypeScript executables were available.
- npm registry access was not available long enough to complete dependency installation.

## Inherited engineering package

Executed the supplied Agent #2 test suite unchanged from the source package.

Result: **55 passed**.

The suite covers the approved NBCC 2010 branch, NBCC 2020 formula and validation cases, source consistency, traceability, modal/dynamic behavior, and public package API behavior.

## API integration

Executed:

```bash
python -m pytest -q backend/tests
```

Result: **4 passed**.

Covered:
- engine/source consistency health check;
- NBCC 2020 calculation through the FastAPI adapter;
- free report preview preserving warnings and safety data;
- fail-closed formal PDF endpoint without approved authentication/entitlement integration.

## Frontend verification

A strict TypeScript static check was run against the authored frontend using local declaration stubs after npm registry installation timed out.

Result: **passed**.

This is not equivalent to a Next.js production build.

## Build status

Frontend production build: **NOT VERIFIED**.

`npm install` could not complete because registry/network access was unavailable in the execution environment. The repository therefore does not yet satisfy the final production-build quality gate.

## Known limitations

- NBCC 2020 production release remains blocked by the engineering handoff.
- Formal PDF rendering/authentication/subscription is not enabled because no approved LinkoTech authentication/entitlement configuration was supplied.
- The validated Agent #2 wheel is supplied as an external immutable artifact and must be installed before starting the API.
