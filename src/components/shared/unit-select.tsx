"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import {
  CATALOG_UNITS,
  DEFAULT_UNITS,
  findUnit,
} from "@/lib/food-cost/units";

import type { UnitDefinition } from "@/lib/food-cost/units";

interface UnitSelectProps {
  id: string;
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  units?: UnitDefinition[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

function optionsWithCurrentValue(
  units: UnitDefinition[],
  value: string,
): UnitDefinition[] {
  if (!value.trim() || findUnit(units, value)) {
    return units;
  }
  const legacy = findUnit(DEFAULT_UNITS, value);
  return legacy ? [...units, legacy] : units;
}

interface UnitSelectControlProps {
  id: string;
  value: string;
  units: UnitDefinition[];
  placeholder: string;
  required: boolean;
  className?: string;
  onValueChange: (value: string) => void;
}

function UnitSelectControl({
  id,
  value,
  units,
  placeholder,
  required,
  className,
  onValueChange,
}: Readonly<UnitSelectControlProps>) {
  const selectValue = findUnit(units, value)?.code ?? value;

  return (
    <Select
      value={selectValue}
      onValueChange={(next) => onValueChange(next ?? value)}
      items={units.map((unit) => ({
        value: unit.code,
        label: unit.code,
      }))}
      required={required}
    >
      <SelectTrigger id={id} className={className ?? "min-h-11 w-full"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {units.map((unit) => (
          <SelectItem key={unit.code} value={unit.code}>
            {unit.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function UnitSelect({
  id,
  name,
  value,
  onValueChange,
  units = CATALOG_UNITS,
  placeholder = "Select unit",
  required = true,
  className,
}: Readonly<UnitSelectProps>) {
  const resolvedUnits = optionsWithCurrentValue(units, value);

  return (
    <>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <UnitSelectControl
        id={id}
        value={value}
        units={resolvedUnits}
        placeholder={placeholder}
        required={required}
        className={className}
        onValueChange={onValueChange}
      />
    </>
  );
}
