import { cn } from "@/lib/utils";

interface PosCategoryTabsProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (value: string | null) => void;
}

function categoryTabClass(selected: boolean) {
  return cn(
    "min-h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    selected
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border/70 bg-card/70 hover:bg-muted",
  );
}

export function PosCategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
}: Readonly<PosCategoryTabsProps>) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1"
      role="tablist"
      aria-label="Categories"
    >
      <button
        type="button"
        role="tab"
        aria-selected={selectedCategory === null}
        onClick={() => onCategoryChange(null)}
        className={categoryTabClass(selectedCategory === null)}
      >
        All
      </button>
      {categories.map((category) => {
        const selected = selectedCategory === category;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onCategoryChange(category)}
            className={categoryTabClass(selected)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}