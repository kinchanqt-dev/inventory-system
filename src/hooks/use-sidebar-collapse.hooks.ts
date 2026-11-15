"use client";

import { useEffect, useState } from "react";

import {
  readSidebarCollapsed,
  writeSidebarCollapsed,
} from "@/lib/sidebar-collapse";

export function useSidebarCollapse() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(readSidebarCollapsed());
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      writeSidebarCollapsed(next);
      return next;
    });
  }

  return { collapsed, toggleCollapsed };
}
