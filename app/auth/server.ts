"use server";

import { cookies } from "next/headers";

import client from "@/lib/api/client";

export type User = {
  anonId: string;
  username: string;
};

export async function getAnonId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("anon_id")?.value ?? null;
}

export async function getUser(): Promise<{
  data: User | null;
  error: Error | null;
}> {
  const anonId = await getAnonId();
  if (!anonId) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await client.GET("/users/{user_id}", {
      params: { path: { user_id: anonId } },
    });

    if (error || !data) {
      return { data: null, error: null };
    }

    return { data: { anonId, username: data.username }, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : null,
    };
  }
}
