"use server";

import { z } from "zod";

import type { components } from "@/lib/api/types";
import { getAnonId } from "@/app/auth/server";
import client from "@/lib/api/client";

export type BalanceResponse = components["schemas"]["BalanceResponse"];

export type InsertBalanceState = {
  data?: BalanceResponse;
  error: string | null;
};

export async function insertBalance(
  _prev: InsertBalanceState,
  payload: FormData,
) {
  const formSchema = z
    .object({
      category: z.string(),
      description: z.string(),
      amount: z.coerce.number(),
    })
    .safeParse({
      category: payload.get("category"),
      description: payload.get("description"),
      amount: payload.get("amount"),
    });

  if (!formSchema.success) {
    return {
      error: "Invalid form data",
    };
  }

  const anonId = await getAnonId();
  if (!anonId) {
    return {
      error: "Unauthorized",
    };
  }

  const { category, description, amount } = formSchema.data;
  const { data, error } = await client.POST("/users/{user_id}/balances", {
    params: { path: { user_id: anonId } },
    body: { category, description, amount },
  });

  if (error || !data) {
    return { error: "残高の追加に失敗しました" };
  }

  return {
    data,
    error: null,
  };
}
