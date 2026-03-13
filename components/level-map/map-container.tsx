import { ReactNode } from "react";

export function MapContainer({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-lg mx-auto bg-card/50 rounded-3xl shadow-sm border-2 border-border overflow-hidden min-h-[70vh] relative">
      <div className="w-full h-full p-6 relative flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
