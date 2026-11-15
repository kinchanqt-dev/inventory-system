function removeBomLineAt<T>(lines: T[], index: number): T[] {
  return lines.length <= 1 ? lines : lines.filter((_, i) => i !== index);
}

export function bindRemoveBomLine<T>(
  setLines: (updater: (current: T[]) => T[]) => void,
) {
  return (index: number) => {
    setLines((current) => removeBomLineAt(current, index));
  };
}

export function isFilledRecipeLine(line: {
  lineKind: "ingredient" | "sub_recipe";
  ingredientId: string;
  subRecipeId: string;
}) {
  return (
    (line.lineKind === "ingredient" && Boolean(line.ingredientId.trim())) ||
    (line.lineKind === "sub_recipe" && Boolean(line.subRecipeId.trim()))
  );
}
