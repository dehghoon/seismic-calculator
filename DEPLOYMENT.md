# Deployment

The web and API are independently deployable.

## API

```bash
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
