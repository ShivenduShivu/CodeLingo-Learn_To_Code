import { ReactNode } from "react";

export function MapContainer({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md mx-auto bg-card/50 rounded-3xl shadow-sm border-2 border-border overflow-hidden min-h-[70vh] relative">
      <div className="w-full h-full px-8 py-16 relative flex flex-col">
        {/* Background vertical line for skill path */}
        <div className="absolute top-12 bottom-12 left-1/2 w-0 border-l-4 border-dashed border-muted-foreground/30 -translate-x-1/2 z-0" />
        {children}
      </div>
    </div>
  );
}
