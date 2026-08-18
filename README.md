# CNBC Seismic Calculator

Web/API integration for the validated `cnbc-seismic-dual-edition` engineering package.

## Architecture

- `backend/`: FastAPI adapter around the validated Agent #2 engine.
- `web/`: Next.js frontend consuming only the REST API.
- `docs/`: architecture, reporting, and deployment notes.
- The validated engineering wheel is supplied separately and must be installed unchanged before starting the API.

The frontend does not re-calculate engineering results. NBCC 2010 and NBCC 2020 remain independent engine branches. Dual comparison is informational and non-governing.

## Implemented workflows

- NBCC 2010 single-edition calculation.
- NBCC 2020 single-edition calculation with explicit external project hazard inputs.
- Dual NBCC 2010 / NBCC 2020 comparison.
- Engine-backed NBCC 2010 locality and SFRS catalogs.
- Engine-backed NBCC 2020 SFRS catalog.
- NBCC 2010 mechanical-period input.
- NBCC 2010 response-spectrum modal input using externally supplied modal periods and mode shapes.
- SRSS/CQC modal-combination input mapping; CQC damping is passed to the validated engine.
- Safety-critical checks, warnings, limitations, applicability information, and validation metadata.
- Engine-output design-spectrum and storey-result visualization.
- Free calculation-report preview following Report Specification v3.0.
- Formal PDF endpoint that fails closed until approved authentication and report-entitlement integration is configured.

## Quick start

### API

```bash
python -m venv .venv
source .venv/bin/activate
pip install ./cnbc_seismic_dual_edition-0.1.0-py3-none-any.whl
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

### Web

```bash
cd web
npm install
npm run typecheck
npm run dev
```

For a production build:

```bash
npm run typecheck
npm run build
npm run start
```

Set `NEXT_PUBLIC_API_BASE_URL` to the API origin.

## API endpoints

- `GET /health`
- `GET /version`
- `GET /api/v1/catalog/options`
- `GET /api/v1/catalog/nbcc-2010/localities`
- `GET /api/v1/catalog/nbcc-2010/sfrs`
- `GET /api/v1/catalog/nbcc-2020/sfrs`
- `POST /api/v1/calculations`
- `POST /api/v1/reports/preview`
- `POST /api/v1/reports/pdf` — Fails closed until approved authentication and report entitlement are configured.

## Validation

Current verified results are recorded in `TEST_RESULTS.md`.

The unchanged Agent #2 engineering package currently passes 55 inherited tests. The application backend/API/catalog/report suite currently passes 9 tests in the provided runtime.

A dependency-backed frontend production build still requires an execution environment with working npm registry access.

## Engineering release status

NBCC 2020 is **not approved for company production engineering release**. The validated engine preserves the Agent #2 hold points, including the missing approved 2020 hazard source/location benchmark and unresolved engineering review items.

The application must not remove, downgrade, or hide those release restrictions.

## Report access status

Core calculations, governing checks, pass/fail state, warnings, limitations, safety/applicability information, and report preview remain available without a report subscription.

Formal PDF generation remains intentionally disabled until approved LinkoTech server-side authentication and an active report entitlement are integrated. Client-side access control is not accepted as authorization.

## Deployment

The frontend and API are independently deployable. Hosts, domains, CORS origins, API URLs, secrets, authentication providers, billing providers, and report storage must remain environment-configured.

No production subdomain is assumed by this repository.
