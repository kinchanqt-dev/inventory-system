"use client";

import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { useId } from "react";

import type { DragEvent } from "react";

import { cn } from "@/lib/utils";

import { useImageDropzoneState } from "@/components/shared/use-image-dropzone-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImageDropzoneProps {
  id?: string;
  name: string;
  label: string;
  hint?: string;
  existingPath?: string | null;
  existingAlt?: string;
  removeLabel?: string;
  removeChecked?: boolean;
  onRemoveChange?: (checked: boolean) => void;
  removeInputName?: string;
  previewFit?: "contain" | "cover";
}

function ImagePreview({
  src,
  alt,
  fit,
  onClear,
}: Readonly<{
  src: string;
  alt: string;
  fit: "contain" | "cover";
  onClear?: () => void;
}>) {
  return (
    <div className="relative w-fit">
      <Image
        src={src}
        alt={alt}
        width={112}
        height={112}
        className={cn(
          "size-28 rounded-lg border bg-muted object-center",
          fit === "contain" ? "object-contain p-2" : "object-cover",
        )}
        unoptimized
      />
      {onClear ? (
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="absolute -top-2 -right-2 rounded-full shadow-sm"
          aria-label="Clear selected image"
          onClick={onClear}
        >
          <X className="size-3.5" aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}

function DropSurface({
  inputId,
  isDragging,
  selectedName,
  onDragState,
  onDropFile,
}: Readonly<{
  inputId: string;
  isDragging: boolean;
  selectedName: string | null;
  onDragState: (dragging: boolean) => void;
  onDropFile: (file: File | undefined) => void;
}>) {
  function preventAndMark(event: DragEvent<HTMLLabelElement>, dragging: boolean) {
    event.preventDefault();
    onDragState(dragging);
  }

  const title = isDragging ? "Drop image here" : "Drag & drop an image here";

  return (
    <label
      htmlFor={inputId}
      onDragEnter={(event) => preventAndMark(event, true)}
      onDragOver={(event) => preventAndMark(event, true)}
      onDragLeave={(event) => preventAndMark(event, false)}
      onDrop={(event) => {
        event.preventDefault();
        onDragState(false);
        onDropFile(event.dataTransfer.files?.[0]);
      }}
      className={cn(
        "flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center transition-colors",
        isDragging
          ? "border-accent bg-accent/10 text-foreground"
          : "border-border bg-muted/30 text-muted-foreground hover:border-foreground/30 hover:bg-muted/50",
      )}
    >
      <ImagePlus className="size-6" aria-hidden />
      <span className="text-sm font-medium text-foreground">{title}</span>
      <span className="text-xs">
        or <span className="underline underline-offset-2">browse files</span>
      </span>
      {selectedName ? (
        <span className="max-w-full truncate text-xs text-foreground">
          Selected: {selectedName}
        </span>
      ) : null}
    </label>
  );
}

function DropzoneFooter({
  existingPath,
  removeInputName,
  removeLabel,
  removeChecked,
  localError,
  hint,
  onRemoveToggle,
}: Readonly<{
  existingPath?: string | null;
  removeInputName?: string;
  removeLabel: string;
  removeChecked: boolean;
  localError: string | null;
  hint: string;
  onRemoveToggle: (checked: boolean) => void;
}>) {
  return (
    <>
      {existingPath ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name={removeInputName}
            value="true"
            checked={removeChecked}
            onChange={(event) => onRemoveToggle(event.target.checked)}
          />
          <span>{removeLabel}</span>
        </label>
      ) : null}
      <p className={localError ? "text-sm text-destructive" : "text-xs text-muted-foreground"}>
        {localError ?? hint}
      </p>
    </>
  );
}

function resolvePreviewSrc(
  selectedPreview: string | null,
  existingPath: string | null | undefined,
  removeChecked: boolean,
) {
  if (selectedPreview) {
    return selectedPreview;
  }
  if (existingPath && !removeChecked) {
    return existingPath;
  }
  return null;
}

export function ImageDropzone({
  id,
  name,
  label,
  hint = "PNG, JPEG, or WebP up to 2MB.",
  existingPath,
  existingAlt = "Image preview",
  removeLabel = "Remove current image",
  removeChecked = false,
  onRemoveChange,
  removeInputName,
  previewFit = "cover",
}: Readonly<ImageDropzoneProps>) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const dropzone = useImageDropzoneState({ onRemoveChange });
  const previewSrc = resolvePreviewSrc(
    dropzone.selectedPreview,
    existingPath,
    removeChecked,
  );

  return (
    <div className="space-y-3">
      <Label htmlFor={inputId}>{label}</Label>

      {previewSrc ? (
        <ImagePreview
          src={previewSrc}
          alt={existingAlt}
          fit={previewFit}
          onClear={dropzone.selectedPreview ? dropzone.clearSelection : undefined}
        />
      ) : null}

      <DropSurface
        inputId={inputId}
        isDragging={dropzone.isDragging}
        selectedName={dropzone.selectedName}
        onDragState={dropzone.setIsDragging}
        onDropFile={dropzone.applyFile}
      />

      <input
        ref={dropzone.inputRef}
        id={inputId}
        name={name}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => dropzone.applyFile(event.target.files?.[0])}
      />

      <DropzoneFooter
        existingPath={existingPath}
        removeInputName={removeInputName}
        removeLabel={removeLabel}
        removeChecked={removeChecked}
        localError={dropzone.localError}
        hint={hint}
        onRemoveToggle={(checked) => {
          onRemoveChange?.(checked);
          if (checked) {
            dropzone.clearSelection();
          }
        }}
      />
    </div>
  );
}
