import { Circle } from "lucide-react";
import type { ReactNode } from "react";
import StarBorder from "@/components/ui/star-border";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  label: string;
};

export function SectionHeader({ label }: SectionHeaderProps) {
  return (
    <div className="relative flex items-center justify-between overflow-hidden border-y border-border px-6 py-3 max-sm:px-3">
      <div className="flex gap-2">
        <Circle
          strokeWidth={1}
          size={15}
          className="text-muted-foreground/30"
        />
        <Circle
          strokeWidth={1}
          size={15}
          className="text-muted-foreground/30"
        />
        <Circle
          strokeWidth={1}
          size={15}
          className="text-muted-foreground/30"
        />
      </div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground/30">
        {label}
      </div>
      <StarBorder />
    </div>
  );
}

type FramedSectionProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function FramedSection({
  label,
  children,
  className,
}: FramedSectionProps) {
  return (
    <section>
      <SectionHeader label={label} />
      <div className="grid grid-cols-[50px_1fr_50px] max-sm:grid-cols-[30px_1fr_30px]">
        <div className="relative overflow-hidden border-r border-border">
          <StarBorder />
        </div>
        <div className="overflow-hidden">
          <div className="relative h-10">
            <StarBorder />
          </div>
          <div className={cn("border-y border-border", className)}>
            {children}
          </div>
          <div className="relative h-10">
            <StarBorder />
          </div>
        </div>
        <div className="relative overflow-hidden border-l border-border">
          <StarBorder />
        </div>
      </div>
    </section>
  );
}

export default FramedSection;
