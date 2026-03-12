import type { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
};

export function Avatar({ className, name, ...props }: AvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-bold", className)} {...props}>
      {initials}
    </div>
  );
}
