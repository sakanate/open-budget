"use server";

import { cookies } from "next/headers";
import { z } from "zod";

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

  // TODO: dbにユーザーを作成し、そのIDをcookieに設定する

  const anonId = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("anon_id", anonId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  console.log(
    `registered new user (username=${result.data.username}, anonId=${anonId})`,
  );

  return { data: { username: result.data.username, anonId }, error: null };
}
