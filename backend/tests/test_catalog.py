from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_catalog_options_preserve_edition_boundaries():
    response = client.get("/api/v1/catalog/options")
    assert response.status_code == 200
    body = response.json()
    assert "site_classes_2010" in body
    assert "nbcc_2020_hazard_note" in body
    assert "No 2020 locality hazard table" in body["nbcc_2020_hazard_note"]


def test_2010_localities_are_served_from_engine_dataset():
    response = client.get("/api/v1/catalog/nbcc-2010/localities")
    assert response.status_code == 200
    body = response.json()
    assert body["count"] > 0
    assert {"index", "locality", "province_code"} <= set(body["items"][0])


def test_sfrs_catalogs_are_separate_by_edition():
    response_2010 = client.get("/api/v1/catalog/nbcc-2010/sfrs")
    response_2020 = client.get("/api/v1/catalog/nbcc-2020/sfrs")
    assert response_2010.status_code == 200
    assert response_2020.status_code == 200
    item_2010 = response_2010.json()["items"][0]
    item_2020 = response_2020.json()["items"][0]
    assert "index" in item_2010
    assert "id" in item_2020
    assert {"SC1", "SC2", "SC3", "SC4"} <= set(item_2020)
