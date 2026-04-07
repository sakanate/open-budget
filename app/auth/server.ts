"use server";

import { cookies } from "next/headers";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

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
  error: Prisma.PrismaClientKnownRequestError | null;
}> {
  const anonId = await getAnonId();
  if (!anonId) {
    return { data: null, error: null };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: anonId } });
    if (!user) {
      return { data: null, error: null };
    }

    return { data: { anonId, username: user.username }, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Prisma.PrismaClientKnownRequestError ? error : null,
    };
  }
}
