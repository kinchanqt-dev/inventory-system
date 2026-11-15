"use client";

import { useState, useTransition } from "react";

import { useFormDirtyGuard } from "@/hooks";

import { ImageDropzone } from "@/components/shared/image-dropzone";
import { Button, Checkbox, Input, Label } from "@/components/ui";

import { SettingsColorFields } from "@/features/settings/components/settings-color-fields";
import { SettingsCurrencyField } from "@/features/settings/components/settings-currency-field";
import { SettingsFormFeedback } from "@/features/settings/components/settings-form-feedback";
import { submitShopSettings } from "@/features/settings/lib/settings-form-submit";
import { normalizeBranding } from "@/features/settings/lib/normalize-branding";

import type { ShopBranding } from "@/features/settings/types/settings.types";

interface SettingsFormProps {
  branding: ShopBranding;
}

export function SettingsForm({ branding }: Readonly<SettingsFormProps>) {
  const safeBranding = normalizeBranding(branding);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showHex, setShowHex] = useState(false);
  const [colors, setColors] = useState({
    primaryColor: safeBranding.primaryColor,
    accentColor: safeBranding.accentColor,
    backgroundColor: safeBranding.backgroundColor,
  });
  const [removeLogo, setRemoveLogo] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dirty = useFormDirtyGuard(isPending);

  function handleSubmit(formData: FormData) {
    setError(null);
    setMessage(null);
    formData.set("primaryColor", colors.primaryColor);
    formData.set("accentColor", colors.accentColor);
    formData.set("backgroundColor", colors.backgroundColor);
    formData.set("removeLogo", removeLogo ? "true" : "false");

    startTransition(async () => {
      const result = await submitShopSettings(formData);
      if ("error" in result) {
        setError(result.error ?? "Could not save settings");
        return;
      }
      setRemoveLogo(false);
      dirty.markClean();
      setMessage(result.message);
    });
  }

  return (
    <form
      action={handleSubmit}
      className="mx-auto grid max-w-2xl gap-6"
      {...dirty.formDirtyProps}
    >
      <section className="space-y-4 rounded-lg border border-border/80 p-4 sm:p-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Shop name</h2>
          <p className="text-sm text-muted-foreground">
            How your shop name appears on login, the header, and the POS screen.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="shopTitle">Shop name</Label>
          <Input
            id="shopTitle"
            name="shopTitle"
            defaultValue={safeBranding.shopTitle}
            required
            maxLength={80}
            className="min-h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Short line under name</Label>
          <Input
            id="tagline"
            name="tagline"
            defaultValue={safeBranding.tagline ?? ""}
            maxLength={80}
            placeholder="Optional, e.g. Fresh meals daily"
            className="min-h-11"
          />
        </div>
      </section>

      <SettingsColorFields
        colors={colors}
        showHex={showHex}
        onShowHexChange={setShowHex}
        onColorsChange={(next) => {
          dirty.markDirty();
          setColors(next);
        }}
      />

      <section className="space-y-4 rounded-lg border border-border/80 p-4 sm:p-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Logo</h2>
          <p className="text-sm text-muted-foreground">
            Optional picture shown next to your shop name.
          </p>
        </div>
        <ImageDropzone
          id="logo"
          name="logo"
          label="Upload logo"
          hint="PNG, JPEG, or WebP up to 2MB."
          existingPath={safeBranding.logoPath}
          existingAlt={`${safeBranding.shopTitle} logo preview`}
          removeLabel="Remove current logo"
          removeChecked={removeLogo}
          onRemoveChange={(checked) => {
            dirty.markDirty();
            setRemoveLogo(checked);
          }}
          previewFit="contain"
        />
      </section>

      <section className="space-y-4 rounded-lg border border-border/80 p-4 sm:p-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Food cost &amp; tax
          </h2>
          <p className="text-sm text-muted-foreground">
            Used for recipe costing, suggested prices, and dashboard targets.
            Most kitchens aim for about 28–35% food cost.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsCurrencyField defaultValue={safeBranding.currencySymbol} />
          <div className="space-y-2">
            <Label htmlFor="salesTaxPercent">Sales tax %</Label>
            <Input
              id="salesTaxPercent"
              name="salesTaxPercent"
              type="number"
              step="0.1"
              min="0"
              max="100"
              defaultValue={safeBranding.salesTaxPercent}
              className="min-h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetFoodCostPercent">Target food cost %</Label>
            <Input
              id="targetFoodCostPercent"
              name="targetFoodCostPercent"
              type="number"
              step="0.1"
              min="1"
              max="100"
              defaultValue={safeBranding.targetFoodCostPercent}
              className="min-h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dashboardYear">Dashboard year</Label>
            <Input
              id="dashboardYear"
              name="dashboardYear"
              type="number"
              min="2020"
              max="2100"
              defaultValue={safeBranding.dashboardYear}
              className="min-h-11"
            />
          </div>
          <div className="flex items-start gap-3 text-sm sm:col-span-2">
            <Checkbox
              id="pricesIncludeTax"
              name="pricesIncludeTax"
              value="true"
              defaultChecked={safeBranding.pricesIncludeTax}
              aria-describedby="pricesIncludeTax-hint"
              className="mt-1"
            />
            <div>
              <Label htmlFor="pricesIncludeTax">Menu prices include tax</Label>
              <p
                id="pricesIncludeTax-hint"
                className="mt-0.5 text-xs text-muted-foreground"
              >
                When checked, food cost % is measured against the price after
                removing tax.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SettingsFormFeedback error={error} message={message} />

      <Button
        type="submit"
        disabled={isPending}
        className="min-h-11 w-full sm:w-auto"
      >
        {isPending ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
