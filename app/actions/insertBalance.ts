"use server";

import { z } from "zod";

import { Balance } from "@/app/generated/prisma/browser";
import { getAnonId } from "@/app/auth/server";
import { prisma } from "@/lib/prisma";

export type InsertBalanceState = {
  data?: Balance;
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
      amount: z.number(),
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
  const balance = await prisma.balance.create({
    data: {
      owner_id: anonId,
      category,
      description,
      amount,
    },
  });

  return {
    data: balance,
    error: null,
  };
}
