export type CalculationPayload = {
  report_metadata: Record<string, unknown>;
  results_by_edition: Record<string, { outputs: Record<string, unknown> }>;
  comparison: Record<string, unknown> | null;
  checks: Array<Record<string, unknown>>;
  warnings: Array<Record<string, unknown>>;
  validation: Record<string, unknown>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function runCalculation(request: unknown): Promise<CalculationPayload> {
  const response = await fetch(`${API_BASE_URL}/api/v1/calculations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Calculation failed with HTTP ${response.status}`);
  }
  return response.json();
}
