from fastapi.testclient import TestClient

from backend.app.main import app
from backend.tests.test_api import valid_2020_request

client = TestClient(app)


def test_report_preview_exposes_pdf_ready_data_contract():
    response = client.post("/api/v1/reports/preview", json=valid_2020_request())
    assert response.status_code == 200
    body = response.json()

    assert body["contract_status"]["complete"] is True
    assert body["contract_status"]["missing_fields"] == []
    assert body["calculation_request"]["run_mode"] == "SINGLE_EDITION"
    assert "NBCC_2020" in body["edition_inputs"]
    assert body["formal_pdf_entitlement_required"] is True
    assert body["official_pdf_available"] is False
    assert "Document Control" == body["section_order"][0]
    assert "Validation / Benchmark Statement" == body["section_order"][-1]


def test_report_preview_preserves_safety_critical_data():
    calculation = client.post("/api/v1/calculations", json=valid_2020_request()).json()
    preview = client.post("/api/v1/reports/preview", json=valid_2020_request()).json()

    assert preview["checks"] == calculation["checks"]
    assert preview["warnings"] == calculation["warnings"]
    assert preview["validation"] == calculation["validation"]
