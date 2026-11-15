import type { KitchenTicketStatus } from "@/types/database.types";

export function formatKitchenTicketAge(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remMin = minutes % 60;
    return `${hours}h ${remMin}m`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function kitchenBumpLabel(status: KitchenTicketStatus) {
  switch (status) {
    case "NEW":
      return "Start cooking";
    case "IN_PROGRESS":
      return "Mark ready";
    case "READY":
      return "Picked up";
    default:
      return "Bump";
  }
}

export function kitchenAgeToneClass(ms: number) {
  if (ms >= 20 * 60 * 1000) {
    return "text-destructive";
  }
  if (ms >= 10 * 60 * 1000) {
    return "text-amber-600 dark:text-amber-400";
  }
  return "text-muted-foreground";
}
