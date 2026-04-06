"use client";

import { createContext, useContext } from "react";

type AnonIdProviderValue = {
  anonId: string | null;
};

const AnonIdContext = createContext<AnonIdProviderValue | undefined>(undefined);

export function AnonIdProvider({
  children,
  anonId,
}: {
  children: React.ReactNode;
  anonId: string | null;
}) {
  return (
    <AnonIdContext.Provider value={{ anonId }}>
      {children}
    </AnonIdContext.Provider>
  );
}

export const useAnonId = () => {
  const context = useContext(AnonIdContext);
  if (!context) {
    throw new Error("useAnonId must be used within an AnonIdProvider");
  }
  return context;
};
