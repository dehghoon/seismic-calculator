from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
try:
    from cnbc_seismic_dual_edition import calculate, validate_source_package
    from cnbc_seismic_dual_edition.exceptions import InputValidationError
    from .adapter import to_engine_request
    from .catalog import router as catalog_router
except ModuleNotFoundError as error:
    if error.name != "cnbc_seismic_dual_edition":
        raise
    catalog_router = None
from .core_handoff import static_core_handoff
from .reporting import build_preview
from .schemas import CalculationRequest

app = FastAPI(
    title="CNBC Seismic Calculator API",
    version="0.1.0",
    description="FastAPI adapter for the validated NBCC 2010 / NBCC 2020 calculation engine.",
)
if catalog_router is not None:
    app.include_router(catalog_router)
else:
    @app.get("/api/v1/catalog/{path:path}", include_in_schema=False)
    def unavailable_catalog(path: str) -> None:
        require_engine()

from .tool_auth import protect_api
app.middleware("http")(protect_api)

allowed_origins = [value.strip() for value in os.getenv("API_ALLOWED_ORIGINS", "http://localhost:3000").split(",") if value.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


async def engineering_input_error(_, exc: Exception):
    return JSONResponse(status_code=422, content={"code": "ENGINEERING_INPUT_INVALID", "message": str(exc)})


if catalog_router is not None:
    app.add_exception_handler(InputValidationError, engineering_input_error)


def require_engine() -> None:
    if catalog_router is None:
        raise HTTPException(status_code=503, detail={
            "code": "SEISMIC_ENGINE_UNAVAILABLE",
            "message": "The validated seismic engine has not been installed.",
        })


@app.get("/health")
def health() -> dict[str, Any]:
    require_engine()
    consistency = validate_source_package()
    return {"status": "ok", "engine_source_consistency": consistency.__dict__}


@app.get("/version")
def version() -> dict[str, str]:
    return {
        "api_version": "0.1.0",
        "engine_version": "0.1.0" if catalog_router is not None else "unavailable",
        "engineering_specification_version": "3.0",
        "nbcc_2020_release_status": "BLOCKED_PENDING_ENGINEERING_APPROVAL",
    }


@app.post("/api/v1/calculations")
def run_calculation(request: CalculationRequest) -> dict[str, Any]:
    require_engine()
    payload = calculate(to_engine_request(request))
    result = payload.to_dict()
    handoff = static_core_handoff(request, result)
    if handoff is not None:
        result["core_static_handoff"] = handoff
    return result


@app.post("/api/v1/reports/preview")
def report_preview(request: CalculationRequest) -> dict[str, Any]:
    require_engine()
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
