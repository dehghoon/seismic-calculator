from math import isclose

from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def valid_2020_request():
    return {
        "run_mode": "SINGLE_EDITION",
        "code_edition": "NBCC_2020",
        "common_inputs": {
            "hn_m": 9.0,
            "n_storeys": 3,
            "storey_heights_m": [3.0, 6.0, 9.0],
            "storey_weights_kn": [100.0, 100.0, 100.0],
            "global_dn_m": 10.0
        },
        "nbcc_2020": {
            "hazard": {
                "hazard_source_id": "project-hazard-rev-A",
                "site_designation_x": "XD",
                "sa_0_2_x": 0.40,
                "sa_0_5_x": 0.35,
                "sa_1_0_x": 0.18,
                "sa_2_0_x": 0.09,
                "sa_5_0_x": 0.04,
                "sa_10_0_x": 0.02,
                "pga_x": 0.20,
                "pgv_x_m_s": 0.10
            },
            "spectrum_interpolation_method": "LINEAR",
            "importance_category": "Low",
            "period_system_type": "Shear Wall",
            "sfrs_id_2020": "N20-SFRS-019",
            "higher_mode_system_type": "Walls, Wall-Frame Systems",
            "irregularity_flags": {str(i): False for i in range(1, 11)},
            "nonorthogonal_sfrs": False,
            "continuous_wood_over_4_storeys": False
        }
    }


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_single_2020_calculation_preserves_release_warning():
    response = client.post("/api/v1/calculations", json=valid_2020_request())
    assert response.status_code == 200
    body = response.json()
    assert "NBCC_2020" in body["results_by_edition"]
    assert body["report_metadata"]["specification_version"] == "3.0"
    assert body["warnings"]


def test_preview_is_free_and_contains_required_safety_data():
    response = client.post("/api/v1/reports/preview", json=valid_2020_request())
    assert response.status_code == 200
    body = response.json()
    assert body["formal_pdf_entitlement_required"] is True
    assert "Warnings and Limitations" in body["section_order"]
    assert "warnings" in body


def test_formal_pdf_fails_closed_without_auth_integration():
    response = client.post("/api/v1/reports/pdf")
    assert response.status_code == 503
    assert response.json()["detail"]["code"] == "REPORT_ENTITLEMENT_NOT_CONFIGURED"


def test_core_handoff_requires_complete_static_forces_and_torsion():
    request = valid_2020_request()
    no_torsion = client.post("/api/v1/calculations", json=request).json()
    assert "core_static_handoff" not in no_torsion
    request["nbcc_2020"]["ex_by_level_m"] = [0.1, 0.1, 0.1]
    response = client.post("/api/v1/calculations", json=request)
    assert response.status_code == 200
    result = response.json()
    handoff = result["core_static_handoff"]
    outputs = result["results_by_edition"]["NBCC_2020"]["outputs"]
    assert [row["forceKN"] for row in handoff["storeys"]] == outputs["static"]["Fx_kN"]
    assert [row["torsionPlusKNm"] for row in handoff["storeys"]] == outputs["torsion"]["Tx_plus_kNm"]
    assert [row["torsionMinusKNm"] for row in handoff["storeys"]] == outputs["torsion"]["Tx_minus_kNm"]
    assert handoff["hazardSourceId"] == "project-hazard-rev-A"


def test_vertical_force_distribution_balances_base_shear():
    response = client.post("/api/v1/calculations", json=valid_2020_request())
    assert response.status_code == 200
    data = response.json()
    assert data["common_inputs"]["storey_heights_m"] == [3.0, 6.0, 9.0]
    static = data["results_by_edition"]["NBCC_2020"]["outputs"]["static"]
    assert len(static["Fx_kN"]) == 3
    assert isclose(sum(static["Fx_kN"]), static["V_kN"])
    assert static["Fx_kN"][-1] >= static["Ft_kN"]
