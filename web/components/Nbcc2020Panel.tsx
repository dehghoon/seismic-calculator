"use client";

import type { CatalogOptions, Sfrs2020 } from "../lib/api";
import { Field, FormSection, SelectField, Toggle } from "./FieldControls";
import type { Nbcc2020Form } from "./calculatorTypes";

export default function Nbcc2020Panel({
  value,
  onChange,
  options,
  sfrs,
}: {
  value: Nbcc2020Form;
  onChange: (value: Nbcc2020Form) => void;
  options: CatalogOptions;
  sfrs: Sfrs2020[];
}) {
  const set = <K extends keyof Nbcc2020Form>(key: K, next: Nbcc2020Form[K]) =>
    onChange({ ...value, [key]: next });

  return (
    <FormSection
      title="NBCC 2020"
      note={options.nbcc_2020_hazard_note}
    >
      <div className="fieldGrid">
        <Field
          label="Hazard source ID"
          value={value.hazardSourceId}
          onChange={(item) => set("hazardSourceId", item)}
        />
        <Field
          label="Site designation X"
          value={value.siteDesignation}
          onChange={(item) => set("siteDesignation", item)}
        />
        <Field label="Sa(0.2, X)" value={value.sa02} onChange={(item) => set("sa02", item)} />
        <Field label="Sa(0.5, X)" value={value.sa05} onChange={(item) => set("sa05", item)} />
        <Field label="Sa(1.0, X)" value={value.sa10} onChange={(item) => set("sa10", item)} />
        <Field label="Sa(2.0, X)" value={value.sa20} onChange={(item) => set("sa20", item)} />
        <Field label="Sa(5.0, X)" value={value.sa50} onChange={(item) => set("sa50", item)} />
        <Field label="Sa(10.0, X)" value={value.sa100} onChange={(item) => set("sa100", item)} />
        <Field label="PGA(X)" value={value.pga} onChange={(item) => set("pga", item)} />
        <Field label="PGV(X)" value={value.pgv} unit="m/s" onChange={(item) => set("pgv", item)} />
        <Field
          label="Sa(0.2, X450), if required"
          value={value.sa02x450}
          onChange={(item) => set("sa02x450", item)}
        />
        <Field
          label="Sa(1.0, X450), if required"
          value={value.sa10x450}
          onChange={(item) => set("sa10x450", item)}
        />
      </div>

      <div className="fieldGrid sectionGap">
        <SelectField
          label="Spectrum interpolation"
          value={value.interpolation}
          onChange={(item) => set("interpolation", item)}
          options={options.spectrum_interpolation_methods.map((item) => [item, item.replace("_", "-")])}
        />
        <SelectField
          label="Importance category"
          value={value.importanceCategory}
          onChange={(item) => set("importanceCategory", item)}
          options={options.importance_categories_2020.map((item) => [item, item])}
        />
        <SelectField
          label="Period system"
          value={value.periodSystem}
          onChange={(item) => set("periodSystem", item)}
          options={options.period_system_types.map((item) => [item, item])}
        />
        <SelectField
          label="Higher-mode system"
          value={value.higherModeSystem}
          onChange={(item) => set("higherModeSystem", item)}
          options={options.higher_mode_system_types_2020.map((item) => [item, item))}
        />
        <SelectField
          label="SFRS"
          value={value.sfrsId}
          onChange={(item) => set("sfrsId", item)}
          options={sfrs.map((item) => [
            item.id,
            `${item.name} · Rd ${item.Rd} · Ro ${item.Ro}`,
          ])}
        />
        <Field
          label="Mechanical period, if supplied"
          value={value.mechanicalPeriod}
          unit="s"
          onChange={(item) => set("mechanicalPeriod", item)}
        />
      </div>

      <div className="toggleRow">
        <Toggle
          label="Non-orthogonal SFRS"
          checked={value.nonorthogonalSfrs}
          onChange={(item) => set("nonorthogonalSfrs", item)}
        />
        <Toggle
          label="Continuous wood over 4 storeys"
          checked={value.continuousWoodOver4Storeys}
          onChange={(item) => set("continuousWoodOver4Storeys", item)}
        />
      </div>

      <div className="irregularityBlock">
        <h3>Irregularities</h3>
        <p>Select only conditions that apply. Type 9 inputs are exposed separately when selected.</p>
        <div className="toggleGrid">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((index) => (
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

      {value.irregularities[9] ? (
        <div className="fieldGrid sectionGap">
          <Field label="QG" value={value.qg} onChange={(item) => set("qg", item)} />
          <Field label="Qy" value={value.qy} onChange={(item) => set("qy", item)} />
        </div>
      ) : null}
    </FormSection>
  );
}
