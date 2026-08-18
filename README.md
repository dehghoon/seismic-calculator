# CNBC Seismic Calculator

Web/API integration for the validated `cnbc-seismic-dual-edition` engineering package.

## Architecture

- `backend/`: FastAPI adapter around the validated Agent #2 engine.
- `web/`: Next.js frontend consuming only the REST API.
- `vendor/`: immutable validated engineering wheel supplied with the project handoff.
- `docs/`: architecture and release notes.

The frontend never recalculates engineering results. NBCC 2010 and NBCC 2020 remain independent engine branches. The dual comparison is informational and non-governing.

## Quick start

### API

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

### Web

```bash
cd web
npm install
npm run dev
```

## Engineering release status

NBCC 2020 is **not approved for production engineering release**. The engine preserves the source hold points, including the missing approved 2020 hazard source/location benchmark and unresolved critical/high review items.

Formal PDF generation is intentionally disabled until an approved LinkoTech authentication/entitlement integration is configured. Free calculation results and report-preview data remain available.
