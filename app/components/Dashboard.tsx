"use client";

import { useState, useActionState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

import {
  insertBalance,
  type BalanceResponse,
  type InsertBalanceState,
} from "@/app/actions/insertBalance";
import { useUser } from "@/app/auth/UserProvider";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

export default function Dashboard({ initBalance }: { initBalance: BalanceResponse[] }) {
  const { username } = useUser();
  const [balance, setBalance] = useState(initBalance);

  const handleAddBalance = useCallback((item: BalanceResponse) => {
    setBalance((prev) => [item, ...prev]);
  }, []);

  const total = balance.reduce((acc, current) => acc + current.amount, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background px-4 py-3 flex items-center justify-between">
        <h1 className="font-semibold">Open Budget</h1>
        <span className="text-sm text-muted-foreground">@{username}</span>
      </header>

      <main className="flex-1 px-4 py-6 pb-28 max-w-lg mx-auto w-full space-y-4">
        <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">合計残高</p>
          <p
            className={cn(
              "text-4xl font-bold tabular-nums",
              total < 0 ? "text-destructive" : "text-foreground",
            )}
          >
            {total < 0 ? "-" : ""}¥{Math.abs(total).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-2">{balance.length} 件</p>
        </div>

        <SearchBar />
        <BudgetList balance={balance} />
      </main>

      <AddBalanceForm onSubmit={handleAddBalance} />
    </div>
  );
}

function SearchBar() {
  // TODO: 検索バーの入力でdescriptionをLIKEで検索するよう実装する
  return (
    <input
      type="text"
      placeholder="摘要で検索..."
      className="w-full rounded-lg border bg-muted/50 px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function BudgetList({ balance }: { balance: BalanceResponse[] }) {
  if (balance.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        まだデータがありません
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {balance.map((item) => (
        <li key={item.id}>
          <Link
            href={`/d/${item.id}`}
            className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
          >
            <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
              {item.category}
            </span>
            <span className="flex-1 truncate text-sm">{item.description}</span>
            <span
              className={cn(
                "shrink-0 tabular-nums text-sm font-semibold",
                item.amount < 0 ? "text-destructive" : "text-foreground",
              )}
            >
              {item.amount < 0 ? "-" : "+"}¥
              {Math.abs(item.amount).toLocaleString()}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function AddBalanceForm({ onSubmit }: { onSubmit?: (item: BalanceResponse) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(insertBalance, {
    error: null,
  } as InsertBalanceState);

  useEffect(() => {
    if (!state.data) return;
    formRef.current?.reset();
    onSubmit?.(state.data);
  }, [state.data, onSubmit]);

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-3 shadow-lg">
      <form
        ref={formRef}
        action={formAction}
        className="mx-auto max-w-lg space-y-2"
      >
        {state.error && (
          <p className="text-xs text-destructive">{state.error}</p>
        )}
        <div className="flex gap-2">
          <input
            name="category"
            type="text"
            placeholder="カテゴリ"
            required
            className="w-24 rounded-lg border bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            name="description"
            type="text"
            placeholder="摘要"
            required
            className="flex-1 rounded-lg border bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            name="amount"
            type="number"
            placeholder="金額"
            required
            className="w-24 rounded-lg border bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "..." : "追加"}
          </Button>
        </div>
      </form>
    </div>
  );
}
