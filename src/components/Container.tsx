import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        {children}
      </div>
    </div>
  );
}