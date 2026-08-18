from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from cnbc_seismic_dual_edition import calculate, validate_source_package
from cnbc_seismic_dual_edition.exceptions import InputValidationError

from .adapter import to_engine_request
from .catalog import router as catalog_router
from .reporting import build_preview
from .schemas import CalculationRequest

app = FastAPI(
    title="CNBC Seismic Calculator API",
    version="0.1.0",
    description="FastAPI adapter for the validated NBCC 2010 / NBCC 2020 calculation engine.",
)
app.include_router(catalog_router)

allowed_origins = [value.strip() for value in os.getenv("API_ALLOWED_ORIGINS", "http://localhost:3000").split(",") if value.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.exception_handler(InputValidationError)
async def engineering_input_error(_, exc: InputValidationError):
    return JSONResponse(status_code=422, content={"code": "ENGINEERING_INPUT_INVALID", "message": str(exc)})


@app.get("/health")
def health() -> dict[str, Any]:
    consistency = validate_source_package()
    return {"status": "ok", "engine_source_consistency": consistency.__dict__}


@app.get("/version")
def version() -> dict[str, str]:
    return {
        "api_version": "0.1.0",
        "engine_version": "0.1.0",
        "engineering_specification_version": "3.0",
        "nbcc_2020_release_status": "BLOCKED_PENDING_ENGINEERING_APPROVAL",
    }


@app.post("/api/v1/calculations")
def run_calculation(request: CalculationRequest) -> dict[str, Any]:
    payload = calculate(to_engine_request(request))
    return payload.to_dict()


@app.post("/api/v1/reports/preview")
def report_preview(request: CalculationRequest) -> dict[str, Any]:
    calculation_request = request.model_dump(exclude_none=True)
    payload = calculate(to_engine_request(request)).to_dict()
    return build_preview(payload, calculation_request)


@app.post("/api/v1/reports/pdf")
def formal_pdf() -> None:
    raise HTTPException(
        status_code=503,
        detail={
            "code": "REPORT_ENTITLEMENT_NOT_CONFIGURED",
            "message": "Formal PDF generation is disabled until approved server-side authentication and report entitlement integration is configured.",
        },
    )
