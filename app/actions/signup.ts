"use server";

import { cookies } from "next/headers";
import { z } from "zod";

import client from "@/lib/api/client";

export type RegisterUserState = {
  data?: {
    username: string;
    anonId: string;
  };
  error: string | null;
};

export async function registerUser(
  _prev: RegisterUserState,
  payload: FormData,
) {
  const result = z
    .object({
      username: z.string().trim(),
    })
    .safeParse({
      username: payload.get("username"),
    });

  if (!result.success) {
    return { error: result.error.issues.join(", ") };
  }

  const { data, error } = await client.POST("/users", {
    body: { username: result.data.username },
  });

  if (error) {
    const detail = (error as { detail?: string }).detail;
    return { error: detail ?? "ユーザーの作成に失敗しました" };
  }

  const cookieStore = await cookies();
  cookieStore.set("anon_id", data.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });

  return { data: { username: data.username, anonId: data.id }, error: null };
}
