# Engineering Engine Setup

Install the validated Agent #2 wheel before installing the API dependencies:

```bash
pip install ./cnbc_seismic_dual_edition-0.1.0-py3-none-any.whl
pip install -r backend/requirements.txt
```

The engineering wheel is intentionally treated as an immutable supplied artifact. Do not recreate or modify its formulas in the API or frontend.


The API can start without the wheel to expose its deployment status. In that state, `/health`, catalogs, calculations and report previews return HTTP 503 with `SEISMIC_ENGINE_UNAVAILABLE`. Install the approved wheel and verify a successful health response and the full API suite before enabling the calculator in production or allowing model writeback.
