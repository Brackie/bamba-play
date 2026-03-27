import type { HTMLAttributes } from "react";

const colorMap: Record<string, string> = {
  arcade: "bg-purple-500/20 text-purple-300",
  puzzle: "bg-green-500/20 text-green-300",
  strategy: "bg-blue-500/20 text-blue-300",
  action: "bg-red-500/20 text-red-300",
  sports: "bg-orange-500/20 text-orange-300",
  racing: "bg-yellow-500/20 text-yellow-300",
  adventure: "bg-teal-500/20 text-teal-300",
  active: "bg-green-500/20 text-green-300",
  inactive: "bg-gray-500/20 text-gray-400",
  coming_soon: "bg-brand-500/20 text-brand-500",
  premium: "bg-amber-500/20 text-amber-300",
  free: "bg-emerald-500/20 text-emerald-300",
  default: "bg-gray-500/20 text-gray-300",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  colorKey?: string;
}

export function Badge({ label, colorKey, className = "", ...props }: BadgeProps) {
  const colors = colorMap[colorKey ?? label] ?? colorMap.default;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors} ${className}`}
      {...props}
    >
      {label}
    </span>
  );
}
