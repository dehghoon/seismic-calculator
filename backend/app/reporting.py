from __future__ import annotations

from typing import Any

REPORT_SECTION_ORDER = [
    "Document Control",
    "Calculation Scope and Code Edition",
    "Source and Hazard Data",
    "Inputs",
    "Assumptions and Boundary Conditions",
    "Site/Hazard and Design Spectrum",
    "Importance / Seismic Category (2020)",
    "SFRS and System Restrictions",
    "Fundamental Period",
    "Higher-Mode Parameters",
    "Equivalent Static Base Shear",
    "Applicability and Irregularities",
    "Static Distribution / Overturning / Torsion",
    "Dynamic Analysis and Scaling, if used",
    "Deflection and Drift",
    "Additional Performance Requirement Status (2020)",
    "Final Results and Governing Checks",
    "Warnings and Limitations",
    "Code Reference Register",
    "Validation / Benchmark Statement",
]

REQUIRED_REPORT_FIELDS = [
    "report_metadata",
    "calculation_request",
    "common_inputs",
    "edition_inputs",
    "results_by_edition",
    "checks",
    "warnings",
    "formula_trace",
    "code_references",
    "validation",
    "display_rules",
    "presentation_elements",
]


def build_preview(payload: dict[str, Any], calculation_request: dict[str, Any]) -> dict[str, Any]:
    report_metadata = dict(payload.get("report_metadata") or {})
    report_metadata.setdefault("report_title", "Seismic Force Calculation - NBCC 2010 / NBCC 2020")
    report_metadata.setdefault("calculation_id", "CNBC_SEISMIC_DUAL_2010_2020")
    report_metadata.setdefault("report_specification_version", "3.0")
    report_metadata.setdefault("review_status", "Draft")

    edition_inputs: dict[str, Any] = {}
    if calculation_request.get("nbcc_2010") is not None:
        edition_inputs["NBCC_2010"] = calculation_request["nbcc_2010"]
    if calculation_request.get("nbcc_2020") is not None:
        edition_inputs["NBCC_2020"] = calculation_request["nbcc_2020"]

    preview: dict[str, Any] = {
        "report_metadata": report_metadata,
        "calculation_request": {
            "run_mode": calculation_request.get("run_mode"),
            "code_edition": calculation_request.get("code_edition"),
        },
        "common_inputs": calculation_request.get("common_inputs", {}),
        "edition_inputs": edition_inputs,
        "results_by_edition": payload.get("results_by_edition", {}),
        "comparison": payload.get("comparison"),
        "checks": payload.get("checks", []),
        "warnings": payload.get("warnings", []),
        "formula_trace": payload.get("formula_trace", []),
        "code_references": payload.get("code_references", []),
        "validation": payload.get("validation", {}),
        "display_rules": payload.get("display_rules", {}),
        "presentation_elements": payload.get("presentation_elements", []),
        "section_order": REPORT_SECTION_ORDER,
        "formal_pdf_entitlement_required": True,
        "official_pdf_available": False,
        "footer_disclaimer": (
            "This calculation report does not replace required professional engineering review. "
            "NBCC 2020 remains blocked from company-approved production release until the approved "
            "hazard benchmark and unresolved engineering hold points are closed."
        ),
    }

    missing_fields = [
        field
        for field in REQUIRED_REPORT_FIELDS
        if field not in preview or preview[field] is None
    ]
    preview["contract_status"] = {
        "required_fields": REQUIRED_REPORT_FIELDS,
        "missing_fields": missing_fields,
        "complete": not missing_fields,
    }
    return preview
