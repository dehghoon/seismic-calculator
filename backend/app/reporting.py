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


def build_preview(payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "report_metadata": payload["report_metadata"],
        "section_order": REPORT_SECTION_ORDER,
        "results_by_edition": payload["results_by_edition"],
        "comparison": payload.get("comparison"),
        "checks": payload["checks"],
        "warnings": payload["warnings"],
        "code_references": payload["code_references"],
        "validation": payload["validation"],
        "display_rules": payload["display_rules"],
        "formal_pdf_entitlement_required": True,
    }
