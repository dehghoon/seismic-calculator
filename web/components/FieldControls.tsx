"use client";

import ParameterHelp from "./ParameterHelp";
import type { ReactNode } from "react";

export function Field({
  label,
  value,
  onChange,
  unit,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}<ParameterHelp label={label} text={label.includes("Site designation")?"X describes the ground/site condition from the geotechnical assessment; XD denotes Class D. It is not a direction or geographic coordinate.":label.includes("Sa(")||label.includes("PGA")?"Copy the official hazard ordinate for the exact project coordinates, edition and site designation. Sa and PGA are in g. Query X450 separately if required.":label.includes("PGV")?"This input is in metres per second. If the official source shows centimetres per second, divide that value by 100.":label.includes("source")?"Record the official query URL or reference, code edition, coordinates, site designation and date. Keep 2010 and 2020 hazard sources separate.":label.includes("elevations")?"List floor elevations above the base in metres, in base-to-roof order, one value per storey. These are not individual storey heights.":label.includes("weights")?"List one seismic weight per floor, in kN, ordered base to roof and consistent with the selected edition’s seismic weight definition.":label.includes("period")||label.includes("Period")?"Period is in seconds and depends on the structural system. A mechanical period must come from a justified analysis. The engine applies its code constraints.":"Choose the actual project condition and code-specific option. See the Illustrated guide parameter table for applicability, units and required sources."}/></span>
      <div className="inputWrap">
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
        {unit ? <em>{unit}</em> : null}
      </div>
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}<ParameterHelp label={label} text={label.includes("Site designation")?"X describes the ground/site condition from the geotechnical assessment; XD denotes Class D. It is not a direction or geographic coordinate.":label.includes("Sa(")||label.includes("PGA")?"Copy the official hazard ordinate for the exact project coordinates, edition and site designation. Sa and PGA are in g. Query X450 separately if required.":label.includes("PGV")?"This input is in metres per second. If the official source shows centimetres per second, divide that value by 100.":label.includes("source")?"Record the official query URL or reference, code edition, coordinates, site designation and date. Keep 2010 and 2020 hazard sources separate.":label.includes("elevations")?"List floor elevations above the base in metres, in base-to-roof order, one value per storey. These are not individual storey heights.":label.includes("weights")?"List one seismic weight per floor, in kN, ordered base to roof and consistent with the selected edition’s seismic weight definition.":label.includes("period")||label.includes("Period")?"Period is in seconds and depends on the structural system. A mechanical period must come from a justified analysis. The engine applies its code constraints.":"Choose the actual project condition and code-specific option. See the Illustrated guide parameter table for applicability, units and required sources."}/></span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select…</option>
        {options.map(([optionValue, optionLabel]) => (
          <option value={optionValue} key={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}<ParameterHelp label={label} text={label.includes("Site designation")?"X describes the ground/site condition from the geotechnical assessment; XD denotes Class D. It is not a direction or geographic coordinate.":label.includes("Sa(")||label.includes("PGA")?"Copy the official hazard ordinate for the exact project coordinates, edition and site designation. Sa and PGA are in g. Query X450 separately if required.":label.includes("PGV")?"This input is in metres per second. If the official source shows centimetres per second, divide that value by 100.":label.includes("source")?"Record the official query URL or reference, code edition, coordinates, site designation and date. Keep 2010 and 2020 hazard sources separate.":label.includes("elevations")?"List floor elevations above the base in metres, in base-to-roof order, one value per storey. These are not individual storey heights.":label.includes("weights")?"List one seismic weight per floor, in kN, ordered base to roof and consistent with the selected edition’s seismic weight definition.":label.includes("period")||label.includes("Period")?"Period is in seconds and depends on the structural system. A mechanical period must come from a justified analysis. The engine applies its code constraints.":"Choose the actual project condition and code-specific option. See the Illustrated guide parameter table for applicability, units and required sources."}/></span>
    </label>
  );
}

export function FormSection({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="formSection">
      <div className="sectionTitle">
        <h2>{title}</h2>
        {note ? <p>{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

