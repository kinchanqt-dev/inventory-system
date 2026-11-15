"use client";

import { useState } from "react";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import {
  DEFAULT_CURRENCY_SYMBOL,
  SUPPORTED_CURRENCIES,
} from "@/features/settings/lib/supported-currencies";

import type { SupportedCurrencySymbol } from "@/features/settings/lib/supported-currencies";

interface SettingsCurrencyFieldProps {
  defaultValue?: string;
}

function asSupportedCurrency(value: string | undefined): SupportedCurrencySymbol {
  const match = SUPPORTED_CURRENCIES.find((currency) => currency.value === value);
  if (match) {
    return match.value;
  }
  return DEFAULT_CURRENCY_SYMBOL;
}

export function SettingsCurrencyField({
  defaultValue,
}: Readonly<SettingsCurrencyFieldProps>) {
  const [currencySymbol, setCurrencySymbol] = useState<SupportedCurrencySymbol>(
    () => asSupportedCurrency(defaultValue),
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="currencySymbol">Currency</Label>
      <input type="hidden" name="currencySymbol" value={currencySymbol} />
      <Select
        value={currencySymbol}
        onValueChange={(next) => {
          if (!next) {
            return;
          }
          setCurrencySymbol(asSupportedCurrency(next));
        }}
        items={SUPPORTED_CURRENCIES.map((currency) => ({
          value: currency.value,
          label: currency.label,
        }))}
      >
        <SelectTrigger id="currencySymbol" className="min-h-11 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_CURRENCIES.map((currency) => (
            <SelectItem key={currency.value} value={currency.value}>
              {currency.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
