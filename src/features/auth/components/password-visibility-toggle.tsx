import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui";

interface PasswordVisibilityToggleProps {
  visible: boolean;
  onToggle: () => void;
}

export function PasswordVisibilityToggle({
  visible,
  onToggle,
}: Readonly<PasswordVisibilityToggleProps>) {
  const label = visible ? "Hide password" : "Show password";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute top-1/2 right-1 min-h-9 min-w-9 -translate-y-1/2"
      aria-label={label}
      aria-pressed={visible}
      onClick={onToggle}
    >
      {visible ? (
        <EyeOff className="size-4" aria-hidden />
      ) : (
        <Eye className="size-4" aria-hidden />
      )}
    </Button>
  );
}