import Image from "next/image";

interface ProductThumbnailProps {
  imagePath?: string | null;
  initials: string;
  size: "sm" | "md";
}

const SIZE_CLASS = {
  sm: "size-10",
  md: "size-12",
} as const;

const SIZE_PX = {
  sm: 40,
  md: 48,
} as const;

export function ProductThumbnail({
  imagePath,
  initials,
  size,
}: Readonly<ProductThumbnailProps>) {
  const dimension = SIZE_PX[size];
  const className = `${SIZE_CLASS[size]} shrink-0 rounded-md object-cover`;

  if (imagePath) {
    return (
      <Image
        src={imagePath}
        alt=""
        width={dimension}
        height={dimension}
        className={className}
        unoptimized
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`flex ${SIZE_CLASS[size]} shrink-0 items-center justify-center rounded-md bg-muted text-sm font-semibold text-muted-foreground`}
    >
      {initials}
    </span>
  );
}