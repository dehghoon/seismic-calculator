# Architecture

## Boundaries

1. The validated `cnbc-seismic-dual-edition` wheel is the engineering authority inside this repository.
2. `backend/app/adapter.py` maps API models to engine dataclasses and enums. It does not implement formulas.
3. FastAPI owns request validation, structured HTTP behavior, OpenAPI, report-preview shaping, and server-side access boundaries.
4. React/Next.js consumes the FastAPI contract only. It contains no engineering equations.
5. NBCC 2010 and NBCC 2020 inputs/results remain edition-scoped. Dual comparison is created only by the engine after both editions complete.

## Report access

Free calculation and preview endpoints return safety-critical checks, warnings, limitations, and validation status. Formal PDF generation fails closed until approved LinkoTech authentication and report entitlement services are integrated.

## Mobile reuse

The API contract and frontend client types are reusable. Browser UI code is kept under `web/` and is not treated as reusable mobile business logic.
