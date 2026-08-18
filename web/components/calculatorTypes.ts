export type Mode = "NBCC_2010" | "NBCC_2020" | "DUAL_COMPARISON";

export type CommonForm = {
  hn: string;
  nStoreys: string;
  elevations: string;
  weights: string;
  dn: string;
};

export type Nbcc2010Form = {
  hazardMode: "LOCALITY" | "CUSTOM";
  province: string;
  locality: string;
  hazardSourceId: string;
  sa02: string;
  sa05: string;
  sa10: string;
  sa20: string;
  pga: string;
  siteClass: string;
  materialGroup: string;
  sfrsIndex: string;
  lateralSystem: string;
  periodSystem: string;
  riskCategory: string;
  mechanicalPeriodEnabled: boolean;
  mechanicalPeriod: string;
  responseSpectrumEnabled: boolean;
  modalPeriods: string;
  modeShapes: string;
  combinationMethod: "SRSS" | "CQC";
  dampingRatio: string;
  irregularities: Record<number, boolean>;
};

export type Nbcc2020Form = {
  hazardSourceId: string;
  siteDesignation: string;
  sa02: string;
  sa05: string;
  sa10: string;
  sa20: string;
  sa50: string;
  sa100: string;
  pga: string;
  pgv: string;
  sa02x450: string;
  sa10x450: string;
  interpolation: string;
  importanceCategory: string;
  periodSystem: string;
  sfrsId: string;
  higherModeSystem: string;
  mechanicalPeriod: string;
  qg: string;
  qy: string;
  nonorthogonalSfrs: boolean;
  continuousWoodOver4Storeys: boolean;
  irregularities: Record<number, boolean>;
};

export const COMMON_INITIAL: CommonForm = {
  hn: "9",
  nStoreys: "3",
  elevations: "3, 6, 9",
  weights: "100, 100, 100",
  dn: "10",
};

export const NBCC_2010_INITIAL: Nbcc2010Form = {
  hazardMode: "LOCALITY",
  province: "",
  locality: "",
  hazardSourceId: "project-custom-2010-hazard",
  sa02: "0.40",
  sa05: "0.25",
  sa10: "0.12",
  sa20: "0.05",
  pga: "0.20",
  siteClass: "C",
  materialGroup: "",
  sfrsIndex: "",
  lateralSystem: "",
  periodSystem: "",
  riskCategory: "Normal",
  mechanicalPeriodEnabled: false,
  mechanicalPeriod: "",
  responseSpectrumEnabled: false,
  modalPeriods: "",
  modeShapes: "",
  combinationMethod: "SRSS",
  dampingRatio: "",
  irregularities: Object.fromEntries(
    Array.from({ length: 8 }, (_, index) => [index + 1, false]),
  ),
};

export const NBCC_2020_INITIAL: Nbcc2020Form = {
  hazardSourceId: "project-2020-hazard-rev-A",
  siteDesignation: "XD",
  sa02: "0.40",
  sa05: "0.35",
  sa10: "0.18",
  sa20: "0.09",
  sa50: "0.04",
  sa100: "0.02",
  pga: "0.20",
  pgv: "0.10",
  sa02x450: "",
  sa10x450: "",
  interpolation: "LINEAR",
  importanceCategory: "Low",
  periodSystem: "",
  sfrsId: "",
  higherModeSystem: "",
  mechanicalPeriod: "",
  qg: "",
  qy: "",
  nonorthogonalSfrs: false,
  continuousWoodOver4Storeys: false,
  irregularities: Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => [index + 1, false]),
  ),
};
