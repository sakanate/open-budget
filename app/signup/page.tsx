"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { registerUser, type RegisterUserState } from "@/app/actions/signup";
import { Button } from "@/app/components/ui/button";

export default function Page() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerUser, {
    error: null,
  } as RegisterUserState);

  useEffect(() => {
    if (!state.data) return;
    router.push("/");
  }, [state.data, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Open Budget</h1>
          <p className="text-sm text-muted-foreground">家計簿を共有しよう</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold">ユーザー名を設定</h2>
            <p className="text-xs text-muted-foreground">
              あなたの名前を入力してください
            </p>
          </div>

          <form action={formAction} className="space-y-3">
            {state.error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {state.error}
              </p>
            )}
            <input
              type="text"
              name="username"
              placeholder="ユーザー名"
              autoFocus
              required
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "登録中..." : "登録して始める"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
