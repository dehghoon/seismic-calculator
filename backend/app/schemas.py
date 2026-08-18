from __future__ import annotations

from typing import Any, Literal
from pydantic import BaseModel, Field, model_validator


class CommonInputs(BaseModel):
    hn_m: float = Field(gt=0)
    n_storeys: int = Field(gt=0)
    storey_heights_m: list[float]
    storey_weights_kn: list[float]
    global_dn_m: float | None = Field(default=None, gt=0)
    storey_dnx_m: list[float] | None = None


class NBCC2010Hazard(BaseModel):
    province: str | None = None
    locality: str | None = None
    sa_0_2: float | None = None
    sa_0_5: float | None = None
    sa_1_0: float | None = None
    sa_2_0: float | None = None
    pga: float | None = None
    hazard_source_id: str = "CNBC2010-V53 embedded locality/custom hazard"


class NBCC2010Modal(BaseModel):
    modal_periods_s: list[float]
    mode_shapes: list[list[float]]
    combination_method: Literal["SRSS", "CQC"]
    damping_ratio: float | None = None


class NBCC2010Inputs(BaseModel):
    hazard: NBCC2010Hazard
    site_class: str
    material_standard_group: str
    sfrs_index: int
    lateral_system_type: str
    period_building_type: str
    risk_category: str
    mechanical_period_enabled: bool
    irregularity_flags: dict[int, bool]
    auto_detect_mass_irregularity: bool
    response_spectrum_enabled: bool
    ta_mechanical_s: float | None = None
    modal: NBCC2010Modal | None = None


class NBCC2020Hazard(BaseModel):
    hazard_source_id: str
    site_designation_x: str
    sa_0_2_x: float
    sa_0_5_x: float
    sa_1_0_x: float
    sa_2_0_x: float
    sa_5_0_x: float
    sa_10_0_x: float
    pga_x: float
    pgv_x_m_s: float
    sa_0_2_x450: float | None = None
    sa_1_0_x450: float | None = None


class NBCC2020Modal(BaseModel):
    modal_periods_s: list[float]
    mode_shapes: list[list[float]]
    combination_method: Literal["SRSS", "CQC"]


class NBCC2020Inputs(BaseModel):
    hazard: NBCC2020Hazard
    spectrum_interpolation_method: Literal["LINEAR", "LOG_LOG"]
    importance_category: Literal["Low", "Normal", "High", "Post-Disaster"]
    period_system_type: str
    sfrs_id_2020: str
    higher_mode_system_type: str
    irregularity_flags: dict[int, bool]
    nonorthogonal_sfrs: bool
    continuous_wood_over_4_storeys: bool
    ta_mechanics_s: float | None = None
    single_storey_diaphragm_period_option: bool = False
    l_diaphragm_m: float | None = None
    qg: float | None = None
    qy: float | None = None
    self_centering_sfrs: bool | None = None
    ex_by_level_m: list[float] | None = None
    delta_max_by_level: list[float] | None = None
    delta_ave_by_level: list[float] | None = None
    modal: NBCC2020Modal | None = None


class CalculationRequest(BaseModel):
    run_mode: Literal["SINGLE_EDITION", "DUAL_COMPARISON"]
    code_edition: Literal["NBCC_2010", "NBCC_2020"] | None = None
    common_inputs: CommonInputs
    nbcc_2010: NBCC2010Inputs | None = None
    nbcc_2020: NBCC2020Inputs | None = None

    @model_validator(mode="after")
    def validate_edition_inputs(self) -> "CalculationRequest":
        if self.run_mode == "SINGLE_EDITION":
            if self.code_edition is None:
                raise ValueError("SINGLE_EDITION requires code_edition.")
            if self.code_edition == "NBCC_2010" and self.nbcc_2010 is None:
                raise ValueError("NBCC_2010 inputs are required.")
            if self.code_edition == "NBCC_2020" and self.nbcc_2020 is None:
                raise ValueError("NBCC_2020 inputs are required.")
        else:
            if self.nbcc_2010 is None or self.nbcc_2020 is None:
                raise ValueError("DUAL_COMPARISON requires both edition input objects.")
        return self


class ApiError(BaseModel):
    code: str
    message: str
    details: Any | None = None
