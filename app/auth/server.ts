"use server";

import { cookies } from "next/headers";

export async function getAnonId() {
  const cookieStore = await cookies();
  const anonId = cookieStore.get("anon_id")?.value;
  if (!anonId) {
    return null;
  }

  return anonId;
}
