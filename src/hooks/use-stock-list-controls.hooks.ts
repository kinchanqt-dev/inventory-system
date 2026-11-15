"use client";

import { useState } from "react";

export function useStockListControls() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  return {
    openId,
    setOpenId,
    lowStockOnly,
    setLowStockOnly,
    query,
    setQuery,
    page,
    setPage,
  };
}
