import Image from "next/image";

interface PosProductImageProps {
  imagePath?: string | null;
  initials: string;
  /** First viewport tiles should load eagerly for LCP. */
  priority?: boolean;
  /** Only the strongest LCP candidate should use high fetch priority. */
  highFetchPriority?: boolean;
}

export function PosProductImage({
  imagePath,
  initials,
  priority = false,
  highFetchPriority = false,
}: Readonly<PosProductImageProps>) {
  if (imagePath) {
    return (
      <Image
        src={imagePath}
        alt=""
        width={480}
        height={360}
        className="size-full object-cover transition duration-200 group-hover:scale-[1.02]"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={highFetchPriority ? "high" : "auto"}
        unoptimized
      />
    );
  }

  return (
    <div className="flex size-full items-center justify-center bg-[linear-gradient(145deg,color-mix(in_oklab,var(--brand-accent,#2f5d50)_12%,transparent),transparent)] text-3xl font-heading font-semibold text-muted-foreground">
      {initials}
    </div>
  );
}