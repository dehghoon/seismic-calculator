"use client";

import { useMemo } from "react";

import type { CatalogOptions, Locality2010, Sfrs2010 } from "../lib/api";
import { Field, FormSection, SelectField, Toggle } from "./FieldControls";
import type { Nbcc2010Form } from "./calculatorTypes";

export default function Nbcc2010Panel({
  value,
  onChange,
  options,
  localities,
  sfrs,
}: {
  value: Nbcc2010Form;
  onChange: (value: Nbcc2010Form) => void;
  options: CatalogOptions;
  localities: Locality2010[];
  sfrs: Sfrs2010[];
}) {
  const provinces = useMemo(
    () => Array.from(new Set(localities.map((item) => item.province_code))).sort(),
    [localities],
  );
  const cities = useMemo(
    () => localities.filter((item) => !value.province || item.province_code === value.province),
    [localities, value.province],
  );

  const set = <K extends keyof Nbcc2010Form>(key: K, next: Nbcc2010Form[K]) =>
    onChange({ ...value, [key]: next });

  return (
    <FormSection
      title="NBCC 2010"
      note="Approved locality and SFRS data are served only from the validated NBCC 2010 engine dataset."
    >
      <div className="segmented">
        <button
          type="button"
          className={value.hazardMode === "LOCALITY" ? "active" : ""}
          onClick={() => set("hazardMode", "LOCALITY")}
        >
          Approved locality
        </button>
        <button
          type="button"
          className={value.hazardMode === "CUSTOM" ? "active" : ""}
          onClick={() => set("hazardMode", "CUSTOM")}
        >
          Custom 2010 hazard
        </button>
      </div>

      {value.hazardMode === "LOCALITY" ? (
        <div className="fieldGrid">
          <SelectField
            label="Province / territory"
            value={value.province}
            onChange={(province) => onChange({ ...value, province, locality: "" })}
            options={provinces.map((item) => [item, item])}
          />
          <SelectField
            label="Locality"
            value={value.locality}
            onChange={(locality) => set("locality", locality)}
            options={cities.map((item) => [item.locality, item.locality])}
          />
        </div>
      ) : (
        <div className="fieldGrid">
          <Field label="Hazard source ID" value={value.hazardSourceId} onChange={(item) => set("hazardSourceId", item)} />
          <Field label="Sa(0.2)" value={value.sa02} onChange={(item) => set("sa02", item)} />
          <Field label="Sa(0.5)" value={value.sa05} onChange={(item) => set("sa05", item)} />
          <Field label="Sa(1.0)" value={value.sa10} onChange={(item) => set("sa10", item)} />
          <Field label="Sa(2.0)" value={value.sa20} onChange={(item) => set("sa20", item)} />
          <Field label="PGA" value={value.pga} onChange={(item) => set("pga", item)} />
        </div>
      )}

      <div className="fieldGrid sectionGap">
        <SelectField
          label="Site Class"
          value={value.siteClass}
          onChange={(item) => set("siteClass", item)}
          options={options.site_classes_2010.map((item) => [item, item])}
        />
        <SelectField
          label="Risk category"
          value={value.riskCategory}
          onChange={(item) => set("riskCategory", item)}
          options={options.risk_categories_2010.map((item) => [item, item])}
        />
        <SelectField
          label="Period system"
          value={value.periodSystem}
          onChange={(item) => set("periodSystem", item)}
          options={options.period_system_types.map((item) => [item, item])}
        />
        <SelectField
          label="Higher-mode system"
          value={value.lateralSystem}
          onChange={(item) => set("lateralSystem", item)}
          options={options.higher_mode_system_types_2010.map((item) => [item, item])}
        />
        <SelectField
          label="Material / standard group"
          value={value.materialGroup}
          onChange={(item) => onChange({ ...value, materialGroup: item, sfrsIndex: "" })}
          options={options.material_standard_groups_2010.map((item) => [item, item))}
        />
        <SelectField
          label="SFRS"
          value={value.sfrsIndex}
          onChange={(item) => set("sfrsIndex", item)}
          options={sfrs.map((item) => [
            String(item.index),
            `${item.name} · Rd ${item.Rd} · Ro ${item.Ro}`,
          ])}
        />
      </div>

      <div className="toggleRow">
        <Toggle
          label="Use mechanical period"
          checked={value.mechanicalPeriodEnabled}
          onChange={(item) => set("mechanicalPeriodEnabled", item)}
        />
        <Toggle
          label="Response-spectrum metadata supplied"
          checked={value.responseSpectrumEnabled}
          onChange={(item) => set("responseSpectrumEnabled", item)}
        />
      </div>
      {value.mechanicalPeriodEnabled ? (
        <div className="fieldGrid sectionGap">
          <Field
            label="Mechanical period"
            value={value.mechanicalPeriod}
            unit="s"
            onChange={(item) => set("mechanicalPeriod", item)}
          />
        </div>
      ) : null}

      <div className="irregularityBlock">
        <h3>Irregularities</h3>
        <p>Select only conditions that apply to the project model.</p>
        <div className="toggleGrid">
          {Array.from({ length: 8 }, (_, index) => index + 1).map((index) => (
            <Toggle
              key={index}
              label={`Type ${index}`}
              checked={value.irregularities[index] ?? false}
              onChange={(checked) =>
                set("irregularities", { ...value.irregularities, [index]: checked })
              }
            />
          ))}
        </div>
      </div>
    </FormSection>
  );
}
