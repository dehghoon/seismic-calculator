from __future__ import annotations

from cnbc_seismic_dual_edition import (
    CalculationRequest as EngineRequest,
    CodeEdition,
    CommonBuildingInputs,
    HigherModeSystemType2010,
    HigherModeSystemType2020,
    ImportanceCategory,
    ModalCombinationMethod,
    NBCC2010HazardInput,
    NBCC2010Inputs,
    NBCC2010ModalInput,
    NBCC2020HazardInput,
    NBCC2020Inputs,
    NBCC2020ModalMetadata,
    PeriodSystemType,
    SpectrumInterpolationMethod,
)

from .schemas import CalculationRequest


def _common(request: CalculationRequest) -> CommonBuildingInputs:
    value = request.common_inputs
    return CommonBuildingInputs(
        hn_m=value.hn_m,
        n_storeys=value.n_storeys,
        storey_heights_m=tuple(value.storey_heights_m),
        storey_weights_kn=tuple(value.storey_weights_kn),
        global_dn_m=value.global_dn_m,
        storey_dnx_m=tuple(value.storey_dnx_m) if value.storey_dnx_m is not None else None,
    )


def _nbcc_2010(value):
    if value is None:
        return None
    modal = None
    if value.modal is not None:
        modal = NBCC2010ModalInput(
            modal_periods_s=tuple(value.modal.modal_periods_s),
            mode_shapes=tuple(tuple(row) for row in value.modal.mode_shapes),
            combination_method=ModalCombinationMethod(value.modal.combination_method),
            damping_ratio=value.modal.damping_ratio,
        )
    return NBCC2010Inputs(
        hazard=NBCC2010HazardInput(**value.hazard.model_dump()),
        site_class=value.site_class,
        material_standard_group=value.material_standard_group,
        sfrs_index=value.sfrs_index,
        lateral_system_type=HigherModeSystemType2010(value.lateral_system_type),
        period_building_type=PeriodSystemType(value.period_building_type),
        risk_category=value.risk_category,
        mechanical_period_enabled=value.mechanical_period_enabled,
        irregularity_flags=value.irregularity_flags,
        auto_detect_mass_irregularity=value.auto_detect_mass_irregularity,
        response_spectrum_enabled=value.response_spectrum_enabled,
        ta_mechanical_s=value.ta_mechanical_s,
        modal=modal,
    )


def _nbcc_2020(value):
    if value is None:
        return None
    modal = None
    if value.modal is not None:
        modal = NBCC2020ModalMetadata(
            modal_periods_s=tuple(value.modal.modal_periods_s),
            mode_shapes=tuple(tuple(row) for row in value.modal.mode_shapes),
            combination_method=ModalCombinationMethod(value.modal.combination_method),
        )
    return NBCC2020Inputs(
        hazard=NBCC2020HazardInput(**value.hazard.model_dump()),
        spectrum_interpolation_method=SpectrumInterpolationMethod(value.spectrum_interpolation_method),
        importance_category=ImportanceCategory(value.importance_category),
        period_system_type=PeriodSystemType(value.period_system_type),
        sfrs_id_2020=value.sfrs_id_2020,
        higher_mode_system_type=HigherModeSystemType2020(value.higher_mode_system_type),
        irregularity_flags=value.irregularity_flags,
        nonorthogonal_sfrs=value.nonorthogonal_sfrs,
        continuous_wood_over_4_storeys=value.continuous_wood_over_4_storeys,
        ta_mechanics_s=value.ta_mechanics_s,
        single_storey_diaphragm_period_option=value.single_storey_diaphragm_period_option,
        l_diaphragm_m=value.l_diaphragm_m,
        qg=value.qg,
        qy=value.qy,
        self_centering_sfrs=value.self_centering_sfrs,
        ex_by_level_m=tuple(value.ex_by_level_m) if value.ex_by_level_m is not None else None,
        delta_max_by_level=tuple(value.delta_max_by_level) if value.delta_max_by_level is not None else None,
        delta_ave_by_level=tuple(value.delta_ave_by_level) if value.delta_ave_by_level is not None else None,
        modal=modal,
    )


def to_engine_request(request: CalculationRequest) -> EngineRequest:
    common = _common(request)
    if request.run_mode == "SINGLE_EDITION":
        edition = CodeEdition(request.code_edition)
        inputs = _nbcc_2010(request.nbcc_2010) if edition is CodeEdition.NBCC_2010 else _nbcc_2020(request.nbcc_2020)
        return EngineRequest.single(edition, common, inputs)
    return EngineRequest.dual(common, _nbcc_2010(request.nbcc_2010), _nbcc_2020(request.nbcc_2020))
