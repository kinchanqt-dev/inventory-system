"use client";

import { useState, useTransition } from "react";

import { ImageDropzone } from "@/components/shared/image-dropzone";
import { Button, Input, Label } from "@/components/ui";

import { updateShopSettingsAction } from "@/features/settings/api/settings.actions";
import { SettingsColorFields } from "@/features/settings/components/settings-color-fields";
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

  function handleSubmit(formData: FormData) {
    setError(null);
    setMessage(null);
    formData.set("primaryColor", colors.primaryColor);
    formData.set("accentColor", colors.accentColor);
    formData.set("backgroundColor", colors.backgroundColor);
    formData.set("removeLogo", removeLogo ? "true" : "false");

    startTransition(async () => {
      const result = await updateShopSettingsAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setRemoveLogo(false);
      setMessage("Shop look saved");
    });
  }

  return (
    <form action={handleSubmit} className="mx-auto grid max-w-2xl gap-6">
      <section className="space-y-4 rounded-xl border border-border/80 p-4 sm:p-5">
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
        onColorsChange={setColors}
      />

      <section className="space-y-4 rounded-xl border border-border/80 p-4 sm:p-5">
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
          onRemoveChange={setRemoveLogo}
          previewFit="contain"
        />
      </section>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">{message}</p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="min-h-11 w-full sm:w-auto"
      >
        {isPending ? "Saving..." : "Save shop look"}
      </Button>
    </form>
  );
}
