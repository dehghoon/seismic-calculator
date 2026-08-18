"use client";

import { useState } from "react";
import {
  getReportPreview,
  type CalculationPayload,
  type EditionResult,
  type ReportPreviewPayload,
} from "../lib/api";

function ScalarTable({ title, value }: { title: string; value: unknown }) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const rows = Object.entries(value as Record<string, unknown>).filter(
    ([, item]) => typeof item !== "object" || item === null,
  );
  if (!rows.length) return null;
  return (
    <div className="tableCard">
      <h3>{title}</h3>
      <table>
        <tbody>
          {rows.map(([key, item]) => (
            <tr key={key}>
              <th>{key.replaceAll("_", " ")}</th>
              <td>
                {item === null
                  ? "—"
                  : typeof item === "number"
                    ? item.toLocaleString(undefined, { maximumFractionDigits: 5 })
                    : String(item)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpectrumPlot({ spectrum }: { spectrum: unknown }) {
  if (!spectrum || typeof spectrum !== "object") return null;
  const source = spectrum as Record<string, unknown>;
  const raw: Array<[number, number]> = [
    [0.2, Number(source.S_0_2)],
    [0.5, Number(source.S_0_5)],
    [1, Number(source.S_1_0)],
    [2, Number(source.S_2_0)],
    [5, Number(source.S_5_0)],
    [10, Number(source.S_10_0)],
  ];
  const points = raw.filter(([, value]) => Number.isFinite(value));
  if (points.length < 2) return null;

  const width = 620;
  const height = 230;
  const pad = 34;
  const maxY = Math.max(...points.map(([, value]) => value), 0.01);
  const x = (period: number) => pad + ((period - 0.2) / 9.8) * (width - 2 * pad);
  const y = (value: number) => height - pad - (value / maxY) * (height - 2 * pad);
  const path = points
    .map(([period, value], index) => `${index ? "L" : "M"} ${x(period)} ${y(value)}`)
    .join(" ");

  return (
    <div className="chartCard">
      <div className="cardHeading">
        <h3>Design spectrum</h3>
        <span>Engine output · Sa/g</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Design spectrum plot">
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} className="axis" />
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} className="axis" />
        <path d={path} className="spectrumLine" fill="none" />
        {points.map(([period, value]) => (
          <g key={period}>
            <circle cx={x(period)} cy={y(value)} r="4" className="spectrumPoint" />
            <text x={x(period)} y={height - 12} textAnchor="middle">{period}</text>
            <text x={x(period)} y={Math.max(14, y(value) - 9)} textAnchor="middle">{value.toFixed(3)}</text>
          </g>
         ))}
      </svg>
    </div>
  );
}

function StoreyTable({ output }: { output: Record<string, unknown> }) {
  const staticResult = output.static as Record<string, unknown> | undefined;
  const fx = staticResult?.Fx_kN as number[] | undefined;
  if (!fx?.length) return null;
  const jx = (staticResult?.Jx as number[] | undefined) ?? [];
  const mx = (staticResult?.Mx_kNm as number[] | undefined) ?? [];
  return (
    <div className="tableCard wide">
      <h3>Storey force distribution</h3>
      <div className="tableScroll">
        <table>
          <thead>
            <tr><th>Level</th><th>Fx (kN)</th><th>Jx</th><th>Mx (kN·m)</th></tr>
          </thead>
          <tbody>
            {fx.map((value, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{value.toFixed(3)}</td>
                <td>{jx[index]?.toFixed?.(3) ?? "—"</td>
                <td>{mx[index]?.toFixed?.(3) ?? "—"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EditionSection({ edition, result }: { edition: string; result: EditionResult }) {
  const output = (result.outputs ?? {}) as Record<string, unknown>;
  return (
    <section className="editionResult">
      <div className="editionHeading">
        <div>
          <p className="eyebrow">Calculation result</p>
          <h2>{edition.replace("_", " ")}</h2>
        </div>
        <span className="statusPill">Validated engine output</span>
      </div>
      <div className="resultGrid">
        <SpectrumPlot spectrum={output.spectrum} />
        <ScalarTable title="Hazard" value={output.hazard} />
        <ScalarTable title="Classification" value={output.classification} />
        <ScalarTable title="SFRS" value={output.sfrs} />
        <ScalarTable title="Fundamental period" value={output.period} />
        <ScalarTable title="Higher-mode parameters" value={output.higher_mode} />
        <ScalarTable title="Equivalent static base shear" value={output.static} />
        <ScalarTable title="Applicability" value={output.applicability} />
        <StoreyTable output={output} />
      </div>
    </section>
  );
}

function ReportPreview({ payload }: { payload: CalculationPayload }) {
  const [preview, setPreview] = useState<ReportPreviewPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const request = payload.calculation_request;
  if (!request || typeof request !== "object") {
    return (
      <section className="reportPreviewCard">
        <div className="cardHeading">
          <h3>Calculation report preview</h3><span>Unavailable</span>
        </div>
        <p>The validated engine payload did not expose the calculation request required by the report preview contract.</p>
      </section>
    );
  }

  async function openPreview() {
    setLoading(true);
    setError("");
    try {
      setPreview(await getReportPreview(request));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Report preview failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="reportPreviewCard">
      <div className="reportPreviewHeader">
        <div>
          <p className="eyebrow">Free report preview</p>
          <h2>Calculation report</h2>
          <p>Preview content preserves the same engineering results, checks, warnings, limitations, and traceability returned by the validated engine.</p>
        </div>
        <button type="button" className="previewButton" onClick={openPreview} disabled={loading}>
          {loading ? "Loading preview…" : preview ? "Refresh preview" : "Open report preview"}
        </button>
      </div>

      {error ? <pre className="inlineError">{error}</pre> : null}

      {preview ? (
        <div className="previewDocument">
          <div className="previewControl">
            <div>
              <strong>{String(preview.report_metadata.report_title ?? "Seismic Force Calculation")}</strong>
              <span>Report Specification v{String(preview.report_metadata.report_specification_version ?? "3.0")}</span>
            </div>
            <div><span>Review status</span><strong>{String(preview.report_metadata.review_status ?? "Draft")}</strong></div>
            <div><span>Contract</span><strong>{preview.contract_status.complete ? "Complete" : "Incomplete"}</strong></div>
          </div>

          <div className="previewNotice">
            <strong>Official PDF access</strong>
            <span>
              {preview.official_pdf_available
                ? "Available through an authorized server-side entitlement."
                : "Not enabled. Formal PDF generation remains locked until approved authentication and report entitlement integration is configured."}
            </span>
          </div>

          <div className="previewSections">
            {preview.section_order.map((section, index) => (
              <div className="previewSectionRow" key={section}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{section}</strong>
              </div>
            ))}
          </div>

          <div className="previewMetrics">
            <div><strong>{preview.checks.length}</strong><span>Checks</span></div>
            <div><strong>{preview.warnings.length}</strong><span>Warnings</span></div>
            <div><strong>{preview.formula_trace.length}</strong><span>Formula trace records</span></div>
            <div><strong>{preview.code_references.length}</strong><span>Code references</span></div>
          </div>

          <details className="rawPayload">
            <summary>Report-ready data contract</summary>
            <pre>{JSON.stringify(preview, null, 2)}</pre>
          </details>
          <p className="reportDisclaimer">{preview.footer_disclaimer}</p>
        </div>
      ) : null}
    </section>
  );
}

export default function ResultsView({ payload }: { payload: CalculationPayload }) {
  return (
    <section className="resultsArea">
      <div className="resultsTitle">
        <div><p className="eyebrow">Engineering review</p><h2>Results, checks, and limitations</h2></div>
        <span>{payload.checks.length} checks · {payload.warnings.length} warnings</span>
      </div>

      {Object.entries(payload.results_by_edition).map(([edition, result]) => (
        <EditionSection edition={edition} result={result} key={edition} />
      ))}

      {payload.comparison ? (
        <div className="comparisonCard"><div className="cardHeading"><h3>2010 vs 2020 comparison</h3><span>Informational · non-governing</span></div><pre>{JSON.stringify(payload.comparison, null, 2)}</pre></div>
      ) : null}

      <div className="reviewGrid">
        <div><h3>Checks</h3>{payload.checks.map((check, index) => (
          <article className={`messageCard ${String(check.status ?? "").toLowerCase()}`} key={index}>
            <strong>{String(check.status ?? "CHECK")} · {check.edition ?? ""}</strong>
            <p>{check.message ?? JSON.stringify(check)}</p>
            <small>{check.formula_id ?? check.formula_ids?.join(", ") ?? ""}{" "}{check.code_reference ?? check.code_reference_ids?.join(", ") ?? ""}</small>
          </article>
        ))}</div>
        <div><h3>Warnings and limitations</h3>{payload.warnings.map((warning, index) => (
          <article className="messageCard warning" key={index}>
            <strong>{warning.severity ?? "WARNING"} · {warning.edition ?? ""}</strong>
            <p>{warning.message ?? JSON.stringify(warning)}</p>
            <small>{warning.formula_id ?? warning.formula_ids?.join(", ") ?? ""}{" "}{warning.code_reference ?? warning.code_reference_ids?.join(", ") ?? ""}</small>
          </article>
        ))}</div>
      </div>

      <ReportPreview payload={payload} />

      <details className="rawPayload"><summary>Traceable calculation payload</summary><pre>{JSON.stringify(payload, null, 2)}</pre></details>
    </section>
  );
}
