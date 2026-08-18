# Deployment

The web and API are independently deployable.

## API

Install the validated Agent #2 engineering wheel unchanged before installing the API dependencies:

```bash
pip install ./cnbc_seismic_dual_edition-0.1.0-py3-none-any.whl
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

Required configuration:

- `API_ALLOWED_ORIGINS`: comma-separated permitted browser origins.
- `REPORT_AUTH_PROVIDER`: reserved for approved LinkoTech authentication integration.
- `REPORT_BILLING_PROVIDER`: reserved for approved report-entitlement integration.

## Web

```bash
cd web
npm install
npm run build
npm run start
```

Configure `NEXT_PUBLIC_API_BASE_URL` with the deployed API origin.

## Portability

No production domain is hard-coded. The frontend and API can be moved independently by changing environment configuration.

## Current limitation

Do not expose `/api/v1/reports/pdf` as a working paid feature until approved server-side authentication and entitlement validation are integrated. The endpoint intentionally fails closed.

NBCC 2020 must not be represented as company-approved for production until the engineering release hold is closed.
