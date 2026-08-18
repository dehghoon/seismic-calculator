"use client";

import { useState, type ChangeEvent } from "react";
import { runCalculation, type CalculationPayload } from "../lib/api";

const sampleRequest = {
  "run_mode": "SINGLE_EDITION",
  "code_edition": "NBCC_2020",
  "common_inputs": {
    "hn_m": 9.0,
    "n_storeys": 3,
    "storey_heights_m": [
      3,
      6,
      9
    ],
    "storey_weights_kn": [
      100,
      100,
      100
    ],
    "global_dn_m": 10
  },
  "nbcc_2020": {
    "hazard": {
      "hazard_source_id": "project-hazard-rev-A",
      "site_designation_x": "XD",
      "sa_0_2_x": 0.4,
      "sa_0_5_x": 0.35,
      "sa_1_0_x": 0.18,
      "sa_2_0_x": 0.09,
      "sa_5_0_x": 0.04,
      "sa_10_0_x": 0.02,
      "pga_x": 0.2,
      "pgv_x_m_s": 0.1
    },
    "spectrum_interpolation_method": "LINEAR",
    "importance_category": "Low",
    "period_system_type": "Shear Wall",
    "sfrs_id_2020": "N20-SFRS-019",
    "higher_mode_system_type": "Walls, Wall-Frame Systems",
    "irregularity_flags": {
      "1": false,
      "2": false,
      "3": false,
      "4": false,
      "5": false,
      "6": false,
      "7": false,
      "8": false,
      "9": false,
      "10": false
    },
    "nonorthogonal_sfrs": false,
    "continuous_wood_over_4_storeys": false
  }
};

export default function Home() {
  const [requestText, setRequestText] = useState(JSON.stringify(sampleRequest, null, 2));
  const [result, setResult] = useState<CalculationPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function calculate() {
    setLoading(true);
    setError("");
    try {
      const parsed = JSON.parse(requestText);
      setResult(await runCalculation(parsed));
    } catch (value) {
      setResult(null);
      setError(value instanceof Error ? value.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header>
        <div>
          <p className="eyebrow">LinkoTech Engineering</p>
          <h1>CNBC Seismic Calculator</h1>
          <p>NBCC 2010 / NBCC 2020 · Single-edition and dual-comparison API workspace</p>
        </div>
        <span className="badge">Engineering review required</span>
      </header>

      <section className="notice">
        <strong>NBCC 2020 production release is blocked.</strong>
        <span>Use explicit approved project hazard inputs. Unresolved engine warnings and limitations remain visible.</span>
      </section>

      <div className="grid">
        <section className="panel">
          <div className="panelHeading">
            <div><p className="eyebrow">Request</p><h2>Calculation input</h2></div>
            <button onClick={() => setRequestText(JSON.stringify(sampleRequest, null, 2))}>Reset sample</button>
          </div>
          <textarea aria-label="Calculation request JSON" value={requestText} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setRequestText(e.target.value)} spellCheck={false} />
          <button className="primary" onClick={calculate} disabled={loading}>{loading ? "Calculating…" : "Run calculation"}</button>
          {error && <pre className="error">{error}</pre>}
        </section>

        <section className="panel">
          <div className="panelHeading"><div><p className="eyebrow">Results</p><h2>Validated engine output</h2></div></div>
          {!result ? <div className="empty">Run a calculation to view results, checks, warnings, and traceable validation metadata.</div> : (
            <>
              <div className="stats">
                <div><strong>{Object.keys(result.results_by_edition).join(", ")}</strong><span>Edition</span></div>
                <div><strong>{result.checks.length}</strong><span>Checks</span></div>
                <div><strong>{result.warnings.length}</strong><span>Warnings</span></div>
              </div>
              <h3>Warnings</h3>
              <div className="cards">{result.warnings.map((warning, index) => <pre key={index}>{JSON.stringify(warning, null, 2)}</pre>)}</div>
              <details><summary>Full calculation payload</summary><pre>{JSON.stringify(result, null, 2)}</pre></details>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
