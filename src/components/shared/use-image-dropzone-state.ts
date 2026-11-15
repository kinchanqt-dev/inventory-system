"use client";

import { useRef, useState } from "react";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 2 * 1024 * 1024;

function isAcceptedFile(file: File) {
  if (!ACCEPTED_TYPES.has(file.type)) {
    return false;
  }
  if (file.size <= 0) {
    return false;
  }
  return file.size <= MAX_BYTES;
}

function assignFileToInput(input: HTMLInputElement, file: File | null) {
  const transfer = new DataTransfer();
  if (file) {
    transfer.items.add(file);
  }
  input.files = transfer.files;
}

function revokePreviewUrl(preview: string | null) {
  if (!preview) {
    return;
  }
  URL.revokeObjectURL(preview);
}

interface UseImageDropzoneStateOptions {
  onRemoveChange?: (checked: boolean) => void;
}

export function useImageDropzoneState({
  onRemoveChange,
}: UseImageDropzoneStateOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  function clearSelection() {
    revokePreviewUrl(selectedPreview);
    setSelectedPreview(null);
    setSelectedName(null);
    if (inputRef.current) {
      assignFileToInput(inputRef.current, null);
    }
  }

  function commitSelectedFile(file: File) {
    revokePreviewUrl(selectedPreview);
    setSelectedPreview(URL.createObjectURL(file));
    setSelectedName(file.name);
    onRemoveChange?.(false);
    if (inputRef.current) {
      assignFileToInput(inputRef.current, file);
    }
  }

  function applyFile(file: File | undefined) {
    setLocalError(null);

    if (!file) {
      clearSelection();
      return;
    }

    if (!isAcceptedFile(file)) {
      setLocalError("Use a PNG, JPEG, or WebP image under 2MB.");
      clearSelection();
      return;
    }

    commitSelectedFile(file);
  }

  return {
    inputRef,
    isDragging,
    setIsDragging,
    selectedPreview,
    selectedName,
    localError,
    clearSelection,
    applyFile,
  };
}
