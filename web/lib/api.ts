export type CheckRecord = {
  edition?: string;
  status?: string;
  formula_id?: string;
  formula_ids?: string[];
  code_reference?: string;
  code_reference_ids?: string[];
  message?: string;
  [key: string]: unknown;
};

export type WarningRecord = {
  edition?: string;
  severity?: string;
  formula_id?: string;
  formula_ids?: string[];
  code_reference?: string;
  code_reference_ids?: string[];
  message?: string;
  [key: string]: unknown;
};

export type EditionResult = {
  outputs?: Record<string, unknown>;
  [key: string]: unknown;
};

export type CalculationPayload = {
  report_metadata: Record<string, unknown>;
  results_by_edition: Record<string, EditionResult>;
  comparison?: Record<string, unknown> | null;
  checks: CheckRecord[];
  warnings: WarningRecord[];
  validation: Record<string, unknown>;
  formula_trace?: Array<Record<string, unknown>>;
  code_references?: Array<Record<string, unknown>>;
  display_rules?: Record<string, unknown>;
  presentation_elements?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

export type ReportPreviewPayload = {
  report_metadata: Record<string, unknown>;
  calculation_request: Record<string, unknown>;
  common_inputs: Record<string, unknown>;
  edition_inputs: Record<string, unknown>;
  results_by_edition: Record<string, EditionResult>;
  comparison?: Record<string, unknown> | null;
  checks: CheckRecord[];
  warnings: WarningRecord[];
  formula_trace: Array<Record<string, unknown>>;
  code_references: Array<Record<string, unknown>>;
  validation: Record<string, unknown>;
  display_rules: Record<string, unknown>;
  presentation_elements: Array<Record<string, unknown>>;
  section_order: string[];
  formal_pdf_entitlement_required: boolean;
  official_pdf_available: boolean;
  footer_disclaimer: string;
  contract_status: {
    required_fields: string[];
    missing_fields: string[];
    complete: boolean;
  };
};

export type CatalogOptions = {
  period_system_types: string[];
  higher_mode_system_types_2010: string[];
  higher_mode_system_types_2020: string[];
  importance_categories_2020: string[];
  risk_categories_2010: string[];
  spectrum_interpolation_methods: string[];
  site_classes_2010: string[];
  material_standard_groups_2010: string[];
  nbcc_2020_hazard_note: string;
};

export type Sfrs2010 = {
  index: number;
  category: string;
  name: string;
  Rd: number;
  Ro: number;
};

export type Sfrs2020 = {
  id: string;
  group: string;
  name: string;
  Rd: number;
  Ro: number;
  SC1: string;
  SC2: string;
  SC3: string;
  SC4: string;
  status: string;
};

export type Locality2010 = {
  index: number;
  locality: string;
  province_code: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with HTTP ${response.status}`);
  }
  return response.json();
}

export async function runCalculation(
  request: unknown,
): Promise<CalculationPayload> {
  return requestJson<CalculationPayload>("/api/v1/calculations", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getReportPreview(
  request: unknown,
): Promise<ReportPreviewPayload> {
  return requestJson<ReportPreviewPayload>("/api/v1/reports/preview", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getCatalogOptions(): Promise<CatalogOptions> {
  return requestJson<CatalogOptions>("/api/v1/catalog/options");
}

export async function getSfrs2010(
  materialStandardGroup?: string,
): Promise<Sfrs2010[]> {
  const query = materialStandardGroup
    ? `?material_standard_group=${encodeURIComponent(materialStandardGroup)}`
    : "";
  const response = await requestJson<{ items: Sfrs2010[] }>(
    `/api/v1/catalog/nbcc-2010/sfrs${query}`,
  );
  return response.items;
}

export async function getSfrs2020(): Promise<Sfrs2020[]> {
  const response = await requestJson<{ items: Sfrs2020[] }>(
    "/api/v1/catalog/nbcc-2020/sfrs",
  );
  return response.items;
}

export async function getLocalities2010(
  province?: string,
): Promise<Locality2010[]> {
  const query = province
    ? `?province=${encodeURIComponent(province)}`
    : "";
  const response = await requestJson<{ items: Locality2010[] }>(
    `/api/v1/catalog/nbcc-2010/localities${query}`,
  );
  return response.items;
}
