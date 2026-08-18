"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getCatalogOptions,
  getLocalities2010,
  getSfrs2010,
  getSfrs2020,
  runCalculation,
  type CalculationPayload,
  type CatalogOptions,
  type Locality2010,
  type Sfrs2010,
  type Sfrs2020,
} from "../lib/api";
import { Field, FormSection } from "./FieldControls";
import Nbcc2010Panel from "./Nbcc2010Panel";
import Nbcc2020Panel from "./Nbcc2020Panel";
import ResultsView from "./ResultsView";
import {
  COMMON_INITIAL,
  NBCC_2010_INITIAL,
  NBCC_2020_INITIAL,
  type CommonForm,
  type Mode,
  type Nbcc2010Form,
  type Nbcc2020Form,
} from "./calculatorTypes";

function parseNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`Invalid numeric value: ${value}`);
  return parsed;
}

function optionalNumber(value: string): number | null {
  if (!value.trim()) return null;
  return parseNumber(value);
}

function parseList(value: string): number[] {
  const tokens = value.split(",").map((item) => item.trim());
  if (!tokens.length || tokens.some((item) => item.length === 0)) {
    throw new Error("Comma-separated numeric lists must not contain empty values.");
  }
  const values = tokens.map((item) => Number(item));
  if (values.some((item) => !Number.isFinite(item))) {
    throw new Error("Comma-separated numeric lists must contain only finite numbers.");
  }
  return values;
}

function parseMatrix(value: string): number[][] {
  return value
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const values = row.split(",").map((item) => Number(item.trim()));
      if (!values.length || values.some((item) => !Number.isFinite(item))) {
        throw new Error("Mode-shape rows must contain only comma-separated finite numbers.");
      }
      return values;
    });
}

function buildCommon(value: CommonForm)) {
  const nStoreys = parseNumber(value.nStoreys);
  const elevations = parseList(value.elevations);
  const weights = parseList(value.weights);
  if (!Number.isInteger(nStoreys) || nStoreys <= 0) {
    throw new Error("Number of storeys must be a positive integer.");
  }
  if (elevations.length !== nStoreys || weights.length !== nStoreys) {
    throw new Error("Storey elevations and weights must each contain exactly n_storeys values.");
  }
  return {
    hn_m: parseNumber(value.hn),
    n_storeys: nStoreys,
    storey_heights_m: elevations,
    storey_weights_kn: weights,
    global_dn_m: optionalNumber(value.dn),
  };
}

function build2010(value: Nbcc2010Form) {
  if (!value.sfrsIndex) throw new Error("Select an NBCC 2010 SFRS.");

  const hazard =
    value.hazardMode === "LOCALITY"
      ? {
          province: value.province,
          locality: value.locality,
          hazard_source_id: "CNBC2010-V53 embedded locality/custom hazard",
        }
      : {
          sa_0_2: parseNumber(value.sa02),
          sa_0_5: parseNumber(value.sa05),
          sa_1_0: parseNumber(value.sa10),
          sa_2_0: parseNumber(value.sa20),
          pga: optionalNumber(value.pga),
          hazard_source_id: value.hazardSourceId,
        };

  const modalPeriods = value.responseSpectrumEnabled ? parseList(value.modalPeriods) : [];
  const modeShapes = value.responseSpectrumEnabled ? parseMatrix(value.modeShapes) : [];
  if (value.responseSpectrumEnabled && modalPeriods.length === 0) {
    throw new Error("At least one modal period is required when response-spectrum analysis is enabled.");
  }
  if (
    value.responseSpectrumEnabled &&
    modeShapes.some((row) => row.length !== modalPeriods.length)
  ) {
    throw new Error("Each mode-shape row must contain one value per modal period.");
  }

  return {
    hazard,
    site_class: value.siteClass,
    material_standard_group: value.materialGroup,
    sfrs_index: Number(value.sfrsIndex),
    lateral_system_type: value.lateralSystem,
    period_building_type: value.periodSystem,
    risk_category: value.riskCategory,
    mechanical_period_enabled: value.mechanicalPeriodEnabled,
    irregularity_flags: value.irregularities,
    auto_detect_mass_irregularity: true,
    response_spectrum_enabled: value.responseSpectrumEnabled,
    ta_mechanical_s: value.mechanicalPeriodEnabled
      ? optionalNumber(value.mechanicalPeriod)
      : null,
    modal: value.responseSpectrumEnabled
      ? {
          modal_periods_s: modalPeriods,
          mode_shapes: modeShapes,
          combination_method: value.combinationMethod,
          damping_ratio:
            value.combinationMethod === "CQC" ? optionalNumber(value.dampingRatio) : null,
        }
      : null,
  };
}

function build2020(value: Nbcc2020Form) {
  if (!value.sfrsId) throw new Error("Select an NBCC 2020 SFRS.");
  return {
    hazard: {
      hazard_source_id: value.hazardSourceId,
      site_designation_x: value.siteDesignation,
      sa_0_2_x: parseNumber(value.sa02),
      sa_0_5_x: parseNumber(value.sa05),
      sa_1_0_x: parseNumber(value.sa10),
      sa_2_0_x: parseNumber(value.sa20),
      sa_5_0_x: parseNumber(value.sa50),
      sa_10_0_x: parseNumber(value.sa100),
      pga_x: parseNumber(value.pga),
      pgv_x_m_s: parseNumber(value.pgv),
      sa_0_2_x450: optionalNumber(value.sa02x450),
      sa_1_0_x450: optionalNumber(value.sa10x450),
    },
    spectrum_interpolation_method: value.interpolation,
    importance_category: value.importanceCategory,
    period_system_type: value.periodSystem,
    sfrs_id_2020: value.sfrsId,
    higher_mode_system_type: value.higherModeSystem,
    irregularity_flags: value.irregularities,
    nonorthogonal_sfrs: value.nonorthogonalSfrs,
    continuous_wood_over_4_storeys: value.continuousWoodOver4Storeys,
    ta_mechanics_s: optionalNumber(value.mechanicalPeriod),
    qg: optionalNumber(value.qg),
    qy: optionalNumber(value.qy),
  };
}

function buildRequest(
  mode: Mode,
  common: CommonForm,
  input2010: Nbcc2010Form,
  input2020: Nbcc2020Form,
) {
  const common_inputs = buildCommon(common);
  if (mode === "DUAL_COMPARISON") {
    return {
      run_mode: "DUAL_COMPARISON",
      common_inputs,
      nbcc_2010: build2010(input2010),
      nbcc_2020: build2020(input2020),
    };
  }
  if (mode === "NBCC_2010") {
    return {
      run_mode: "SINGLE_EDITION",
      code_edition: "NBCC_2010",
      common_inputs,
      nbcc_2010: build2010(input2010),
    };
  }
  return {
    run_mode: "SINGLE_EDITION",
    code_edition: "NBCC_2020",
    common_inputs,
    nbcc_2020: build2020(input2020),
  };
}

export default function CalculatorWorkspace() {
  const [mode, setMode] = useState<Mode>("NBCC_2020");
  const [common, setCommon] = useState(COMMON_INITIAL);
  const [input2010, setInput2010] = useState(NBCC_2010_INITIAL);
  const [input2020, setInput2020] = useState(NBCC_2020_INITIAL);
  const [options, setOptions] = useState<CatalogOptions | null>(null);
  const [localities, setLocalities] = useState<Locality2010[]>([]);
  const [sfrs2010, setSfrs2010] = useState<Sfrs2010[]>([]);
  const [sfrs2020, setSfrs2020] = useState<Sfrs2020[]>([]);
  const [payload, setPayload] = useState<CalculationPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getCatalogOptions(), getLocalities2010(), getSfrs2020()])
      .then(([catalog, localityRows, systems2020]) => {
        setOptions(Catalog);
        setLocalities(localityRows);
        setSfrs2020(systems2020);
        setInput2010((current) => ({
          ...current,
          materialGroup:
            current.materialGroup || catalog.material_standard_groups_2010[0] || "",
          periodSystem: current.periodSystem || catalog.period_system_types[0] || "",
          lateralSystem:
            current.lateralSystem || catalog.higher_mode_system_types_2010[0] || "",
        }));
        setInput2020((current) => ({
          ...current,
          periodSystem: current.periodSystem || catalog.period_system_types[0] || "",
          higherModeSystem:
            current.higherModeSystem || catalog.higher_mode_system_types_2020[0] || "",
          sfrsId: current.sfrsId || systems2020[0]?.id || "",
        }));
      })
      .catch((cause) =>
        setError(cause instanceof Error ? cause.message : "Catalog load failed."),
      );
  }, []);

  useEffect(() => {
    if (!input2010.materialGroup) return;
    getSfrs2010(input2010.materialGroup)
      .then((rows) => {
        setSfrs2010(rows);
        setInput2010((current) => ({
          ...current,
          sfrsIndex: rows.some((row) => String(row.index) === current.sfrsIndex)
            ? current.sfrsIndex
            : rows[0]
              ? String(rows[0].index)
              : "",
        }));
      })
      .catch((cause) =>
        setError(cause instanceof Error ? cause.message : "SFRS load failed."),
      );
  }, [input2010.materialGroup]);

  const provinces = useMemo(
    () => Array.from(new Set(localities.map((item) => item.province_code))).sort(),
    [localities],
  );

  useEffect(() => {
    if (input2010.hazardMode !== "LOCALITY") return;
    if (!input2010.province && provinces[0]) {
      setInput2010((current) => ({ ...current, province: provinces[0] }));
      return;
    }
    const candidates = localities.filter(
      (item) => item.province_code === input2010.province,
    );
    if (
      input2010.province &&
      !candidates.some((item) => item.locality === input2010.locality)
    ) {
      setInput2010((current) => ({
        ...current,
        locality: candidates[0]?.locality ?? "",
      }));
    }
  }, [
    input2010.hazardMode,
    input2010.province,
    input2010.locality,
    localities,
    provinces,
  ]);

  async function calculate() {
    setLoading(true);
    setError("");
    setPayload(null);
    try {
      const request = buildRequest(mode, common, input2010, input2020);
      const result = await runCalculation(request);
      setPayload({
        ...result,
        calculation_request:
          result.calculation_request && typeof result.calculation_request === "object"
            ? result.calculation_request
            : (request as Record<string, unknown>),
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Calculation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">LinkoTech Engineering</p>
          <h1>CNBC Seismic Calculator</h1>
          <p>NBCC 2010 / NBCC 2020 dual-edition seismic calculation workspace</p>
        </div>
        <div className="heroMeta">
          <span>Specification v3.0</span>
          <span>Engine v0.1.0</span>
        </div>
      </header>

      <div className="releaseBanner">
        <strong>NBCC 2020 production approval is blocked.</strong>
        <span>
          An approved 2020 hazard source/location benchmark and unresolved engineering hold
          points must be closed before company-approved production release.
        </span>
      </div>

      <nav className="modeTabs" aria-label="Calculation mode">
        {(
          [
            ["NBCC_2010", "NBCC 2010"],
            ["NBCC_2020", "NBCC 2020"],
            ["DUAL_COMPARISON", "Dual comparison"],
          ] as Array<[Mode, string]>
        ).map(([value, label]) => (
          <button
            type="button"
            className={mode === value ? "active" : ""}
            onClick={() => setMode(value)}
            key={value}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="workspace">
        <div className="formStack">
          <FormSection
            title="Building model"
            note="Only geometry and load data demonstrably common to the same building model are shared between editions."
          >
            <div className="fieldGrid">
              <Field label="Building height Hn" value={common.hn} unit="m" onChange={(hn) => setCommon({ ...common, hn })} />
              <Field label="Number of storeys" value={common.nStoreys} onChange={(nStoreys) => setCommon({ ...common, nStoreys })} />
              <Field label="Plan dimension Dn" value={common.dn} unit="m" onChange={(dn) => setCommon({ ...common, dn })} />
              <Field label="Storey elevations" value={common.elevations} unit="m, comma-separated" onChange={(elevations) => setCommon({ ...common, elevations })} />
              <Field label="Storey weights" value={common.weights} unit="kN, comma-separated" onChange={(weights) => setCommon({ ...common, weights })} />
            </div>
          </FormSection>

          {mode !== "NBCC_2020" && options ? (
            <Nbcc2010Panel
              value={input2010}
              onChange={setInput2010}
              options={options}
              localities={localities}
              sfrs={sfrs2010}
            />
          ) : null}

          {mode !== "NBCC_2010" && options ? (
            <Nbcc2020Panel
              value={input2020}
              onChange={setInput2020}
              options={options}
              sfrs={sfrs2020}
            />
          ) : null}

          {error ? <pre className="inlineError">{error}</pre> : null}

          <div className="runBar">
            <div>
              <strong>Core engineering calculations and safety results remain available to all users.</strong>
              <span>Formal PDF generation remains server-authorized and entitlement-controlled.</span>
            </div>
            <button
              type="button"
              className="runButton"
              disabled={loading || !options}
              onClick={calculate}
            >
              {loading
                ? "Calculating…"
                : mode === "DUAL_COMPARISON"
                  ? "Run dual comparison"
                  : "Run calculation"}
            </button>
          </div>
        </div>

        <aside className="sidebar">
          <div className="sideCard">
            <p className="eyebrow">Edition separation</p>
            <h3>No cross-edition engineering data</h3>
            <p>
              Hazard, SFRS, higher-mode data, restrictions, and formula logic remain
              edition-scoped.
            </p>
          </div>
          <div className="sideCard">
            <p className="eyebrow">Safety</p>
            <h3>Warnings are never paywalled</h3>
            <p>Failed checks, invalid inputs, limitations, and applicability messages remain visible.</p>
          </div>
          <div className="sideCard">
            <p className="eyebrow">Dynamic input</p>
            <h3>Modal data stays external</h3>
            <p>
              When response-spectrum analysis is enabled, the UI only accepts modal data
              produced by the structural analysis model and passes it unchanged to the validated engine.
            </p>
          </div>
        </aside>
      </div>

      {payload ? <ResultsView payload={payload} /> : null}
    </main>
  );
}
