export function nextStockQuantity(options: {
  currentQuantity: number;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
}) {
  if (options.type === "IN") {
    return options.currentQuantity + options.quantity;
  }

  if (options.type === "OUT") {
    return options.currentQuantity - options.quantity;
  }

  return options.quantity;
}
