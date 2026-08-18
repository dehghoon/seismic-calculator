# Engineering Engine Setup

Install the validated Agent #2 wheel before installing the API dependencies:

```bash
pip install ./cnbc_seismic_dual_edition-0.1.0-py3-none-any.whl
pip install -r backend/requirements.txt
```

The engineering wheel is intentionally treated as an immutable supplied artifact. Do not recreate or modify its formulas in the API or frontend.
