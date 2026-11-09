"use client";

import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Button,
  Input,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";

import { BRANDING_LOOKS } from "@/features/settings/lib/branding-looks";

interface ColorValues {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
}

interface SettingsColorFieldsProps {
  colors: ColorValues;
  showHex: boolean;
  onShowHexChange: (show: boolean) => void;
  onColorsChange: (colors: ColorValues) => void;
}

function FieldHint({
  label,
  children,
}: Readonly<{ label: string; children: string }>) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label={label}
          />
        }
      >
        <Info className="size-3.5" aria-hidden />
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

function ColorField({
  id,
  label,
  hintLabel,
  hint,
  example,
  value,
  showHex,
  onChange,
}: Readonly<{
  id: string;
  label: string;
  hintLabel: string;
  hint: string;
  example: string;
  value: string;
  showHex: boolean;
  onChange: (value: string) => void;
}>) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={showHex ? id : `${id}Picker`}>{label}</Label>
        <FieldHint label={hintLabel}>{hint}</FieldHint>
      </div>
      <p className="text-xs text-muted-foreground">{example}</p>
      <div className="flex items-center gap-2">
        <Input
          id={`${id}Picker`}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-14 cursor-pointer p-1"
          aria-label={`${label} picker`}
        />
        {showHex ? (
          <Input
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            pattern="^#[0-9A-Fa-f]{6}$"
            required
            className="min-h-11"
            aria-label={`${label} code`}
          />
        ) : (
          <span className="text-sm text-muted-foreground tabular-nums">
            {value.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}

export function SettingsColorFields({
  colors,
  showHex,
  onShowHexChange,
  onColorsChange,
}: Readonly<SettingsColorFieldsProps>) {
  function applyLook(look: (typeof BRANDING_LOOKS)[number]) {
    onColorsChange({
      primaryColor: look.primaryColor,
      accentColor: look.accentColor,
      backgroundColor: look.backgroundColor,
    });
  }

  const activeLookId =
    BRANDING_LOOKS.find(
      (look) =>
        look.primaryColor.toLowerCase() === colors.primaryColor.toLowerCase() &&
        look.accentColor.toLowerCase() === colors.accentColor.toLowerCase() &&
        look.backgroundColor.toLowerCase() ===
          colors.backgroundColor.toLowerCase(),
    )?.id ?? null;

  return (
    <section className="space-y-5 rounded-xl border border-border/80 p-4 sm:p-5">
      <div>
        <h2 className="text-base font-semibold tracking-tight">Colors</h2>
        <p className="text-sm text-muted-foreground">
          Pick a ready-made look, or fine-tune the three colors below.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Ready-made looks</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {BRANDING_LOOKS.map((look) => {
            const isActive = activeLookId === look.id;

            return (
              <button
                key={look.id}
                type="button"
                onClick={() => applyLook(look)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isActive
                    ? "border-foreground bg-muted/60"
                    : "border-border/80 hover:bg-muted/40",
                )}
              >
                <span className="mb-2 flex gap-1.5" aria-hidden>
                  <span
                    className="size-5 rounded-full border"
                    style={{ backgroundColor: look.primaryColor }}
                  />
                  <span
                    className="size-5 rounded-full border"
                    style={{ backgroundColor: look.accentColor }}
                  />
                  <span
                    className="size-5 rounded-full border"
                    style={{ backgroundColor: look.backgroundColor }}
                  />
                </span>
                <span className="block text-sm font-medium">{look.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {look.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ColorField
          id="primaryColor"
          label="Main button color"
          hintLabel="Main button color help"
          hint="Used for big action buttons. Button text adjusts automatically."
          example="Example: dark brown or black"
          value={colors.primaryColor}
          showHex={showHex}
          onChange={(primaryColor) =>
            onColorsChange({ ...colors, primaryColor })
          }
        />
        <ColorField
          id="accentColor"
          label="Highlight color"
          hintLabel="Highlight color help"
          hint="Used for the active menu item and small highlights."
          example="Example: warm brown or green"
          value={colors.accentColor}
          showHex={showHex}
          onChange={(accentColor) => onColorsChange({ ...colors, accentColor })}
        />
        <ColorField
          id="backgroundColor"
          label="Page background"
          hintLabel="Page background help"
          hint="Light page color behind everything. Keep this pale so text stays readable."
          example="Example: soft cream or off-white"
          value={colors.backgroundColor}
          showHex={showHex}
          onChange={(backgroundColor) =>
            onColorsChange({ ...colors, backgroundColor })
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <p className="text-xs text-muted-foreground">
          Night mode keeps its own dark page; your highlight still shows there.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="min-h-11"
          aria-pressed={showHex}
          onClick={() => onShowHexChange(!showHex)}
        >
          {showHex ? "Hide color codes" : "Show color codes"}
        </Button>
      </div>
    </section>
  );
}
