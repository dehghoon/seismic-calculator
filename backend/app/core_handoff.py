from math import isclose, isfinite

from .schemas import CalculationRequest


def static_core_handoff(request: CalculationRequest, calculation: dict) -> dict | None:
    """Export the engine's single-direction 2020 static result for explicit model review."""
    if request.run_mode != "SINGLE_EDITION" or request.code_edition != "NBCC_2020":
        return None
    inputs = request.nbcc_2020
    if inputs is None or inputs.modal is not None:
        return None
    edition = calculation["results_by_edition"]["NBCC_2020"]
    outputs = edition["outputs"]
    static, torsion = outputs["static"], outputs["torsion"]
    if (
        not outputs["applicability"]["ESFP_permitted"]
        or outputs["sfrs"]["restriction_status"] != "PASS"
        or outputs["sfrs"]["footnote_review_required"]
        or outputs["direction_of_loading"]["required_100_plus_30"]
        or torsion["status"] != "PASS"
        or any(check["status"] == "FAIL" for check in edition["checks"])
    ):
        return None

    heights = request.common_inputs.storey_heights_m
    forces = static["Fx_kN"]
    plus, minus = torsion["Tx_plus_kNm"], torsion["Tx_minus_kNm"]
    values = (heights, forces, plus, minus)
    if any(v is None or len(v) != request.common_inputs.n_storeys or not all(map(isfinite, v)) for v in values):
        return None
    if not isclose(sum(forces), static["V_kN"], rel_tol=1e-8, abs_tol=1e-8):
        return None
    return {
        "schema": "linkoteq.seismic.static.v1",
        "codeEdition": "NBCC_2020",
        "hazardSourceId": inputs.hazard.hazard_source_id,
        "siteDesignation": inputs.hazard.site_designation_x,
        "sfrsId": inputs.sfrs_id_2020,
        "baseShearKN": static["V_kN"],
        "storeys": [
            {"heightM": h, "forceKN": f, "torsionPlusKNm": p, "torsionMinusKNm": m}
            for h, f, p, m in zip(*values, strict=True)
        ],
        "warnings": [warning["message"] for warning in edition["warnings"]],
    }
