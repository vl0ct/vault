import { Children, type ReactNode } from "react";

type LandingGridProps = {
  children: ReactNode;
};

function SideScale({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none row-span-full row-start-1 z-50 border-x border-border ${className}`}
    />
  );
}

export function LandingGrid({ children }: LandingGridProps) {
  const rowCount = Children.count(children);
  const gridRows = Array.from({ length: rowCount * 2 - 1 }, (_, i) =>
    i % 2 === 0 ? "auto" : "1px",
  ).join("_");

  return (
    <div
      className="relative grid min-h-screen grid-cols-[1fr_1rem_auto_1rem_1fr] overflow-hidden"
      style={{ gridTemplateRows: gridRows.replace(/_/g, " ") }}
    >
      {Children.map(children, (section, i) => {
        const contentRow = i * 2 + 1;
        const dividerRow = contentRow + 1;
        const isLast = i === rowCount - 1;
        return (
          <>
            <div
              className="col-start-3 flex w-[90vw] flex-col"
              style={{ gridRow: contentRow }}
            >
              {section}
            </div>
            {!isLast && (
              <div
                className="pointer-events-none relative col-start-3 border-b border-border w-full"
                style={{ gridRow: dividerRow }}
              />
            )}
          </>
        );
      })}

      <SideScale className="col-start-2" />
      <SideScale className="col-start-4" />
    </div>
  );
}

export default LandingGrid;
