from __future__ import annotations

from fastapi import APIRouter, Query
from cnbc_seismic_dual_edition import (
    HigherModeSystemType2010,
    HigherModeSystemType2020,
    ImportanceCategory,
    PeriodSystemType,
    SpectrumInterpolationMethod,
)
from cnbc_seismic_dual_edition.data_loader import (
    nbcc_2010_localities,
    nbcc_2010_sfrs_rows,
    nbcc_2020_sfrs_rows,
)

router = APIRouter(prefix="/api/v1/catalog", tags=["catalog"])


@router.get("/options")
def options() -> dict[str, object]:
    rows_2010 = nbcc_2010_sfrs_rows()
    return {
        "period_system_types": [item.value for item in PeriodSystemType],
        "higher_mode_system_types_2010": [item.value for item in HigherModeSystemType2010],
        "higher_mode_system_types_2020": [item.value for item in HigherModeSystemType2020],
        "importance_categories_2020": [item.value for item in ImportanceCategory],
        "risk_categories_2010": ["Low", "Normal", "High", "Post-disaster"],
        "spectrum_interpolation_methods": [item.value for item in SpectrumInterpolationMethod],
        "site_classes_2010": ["A", "B", "C", "D", "E"],
        "material_standard_groups_2010": sorted({row["category_en"] for row in rows_2010}),
        "nbcc_2020_hazard_note": (
            "NBCC 2020 hazard values are external project inputs. "
            "No 2020 locality hazard table is provided by the validated engine."
        ),
    }


@router.get("/nbcc-2010/localities")
def localities_2010(province: str | None = Query(default=None)) -> dict[str, object]:
    rows = nbcc_2010_localities()
    if province:
        code = province.strip().upper()
        rows = tuple(row for row in rows if row["province_code"].strip().upper() == code)
    return {
        "count": len(rows),
        "items": [
            {
                "index": int(row["index"]),
                "locality": row["locality"],
                "province_code": row["province_code"],
            }
            for row in rows
        ],
    }


@router.get("/nbc-2010/sfrs")
def sfrs_2010(material_standard_group: str | None = Query(default=None)) -> dict[str, object]:
    rows = nbcc_2010_sfrs_rows()
    if material_standard_group:
        rows = tuple(row for row in rows if row["category_en"] == material_standard_group)
    return {
        "count": len(rows),
        "items": [
            {
                "index": int(row["index"]),
                "category": row["category_en"],
                "name": row["name_en"],
                "Rd": float(row["Rd"]),
                "Ro": float(row["Ro"]),
            }
            for row in rows
        ],
    }


@router.get("/nbcc-2020/sfrs")
def sfrs_2020() -> dict[str, object]:
    rows = nbcc_2020_sfrs_rows()
    return {
        "count": len(rows),
        "items": [
            {
                "id": row["id"],
                "group": row["group"],
                "name": row["name"],
                "Rd": float(row["Rd"]),
                "Ro": float(row["Ro"]),
                "SC1": row["SC1"],
                "SC2": row["SC2"],
                "SC3": row["SC3"],
                "SC4": row["SC4"],
                "status": row["status"],
            }
            for row in rows
        ],
    }
