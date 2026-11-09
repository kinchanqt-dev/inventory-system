"use client";

import { useState } from "react";

import { ImageDropzone } from "@/components/shared/image-dropzone";

interface ProductImageFieldProps {
  imagePath?: string | null;
  productName?: string;
}

export function ProductImageField({
  imagePath,
  productName,
}: Readonly<ProductImageFieldProps>) {
  const [removeImage, setRemoveImage] = useState(false);

  return (
    <ImageDropzone
      id="image"
      name="image"
      label="Product image (optional)"
      hint="PNG, JPEG, or WebP up to 2MB. Helps staff recognize items faster."
      existingPath={imagePath}
      existingAlt={productName ? `${productName} preview` : "Product preview"}
      removeLabel="Remove current image"
      removeChecked={removeImage}
      removeInputName="removeImage"
      onRemoveChange={setRemoveImage}
      previewFit="cover"
    />
  );
}
