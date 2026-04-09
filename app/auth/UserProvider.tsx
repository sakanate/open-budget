"use client";

import { createContext, useContext } from "react";

type UserProviderValue = {
  anonId: string | null;
  username: string | null;
};

const UserContext = createContext<UserProviderValue | undefined>(undefined);

export function UserProvider({
  children,
  anonId,
  username,
}: {
  children: React.ReactNode;
  anonId: string | null | undefined;
  username: string | null | undefined;
}) {
  return (
    <UserContext.Provider
      value={{ anonId: anonId ?? null, username: username ?? null }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
