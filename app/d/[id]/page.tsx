import Link from "next/link";

import { getUser } from "@/app/auth/server";
import client from "@/lib/api/client";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: user } = await getUser();

  const balance = user
    ? (await client.GET("/users/{user_id}/balances", {
        params: { path: { user_id: user.anonId } },
      })).data?.find((b) => b.id === id)
    : null;

  if (!balance) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-sm">データが見つかりませんでした</p>
          <Link href="/" className="text-sm underline underline-offset-4">
            ← 一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8">
      <div className="max-w-lg mx-auto space-y-4">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 一覧に戻る
        </Link>

        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                {balance.category}
              </span>
              <h2 className="text-lg font-semibold mt-2">{balance.description}</h2>
            </div>
            <p
              className={`text-2xl font-bold tabular-nums shrink-0 ${
                balance.amount < 0 ? "text-destructive" : "text-foreground"
              }`}
            >
              {balance.amount < 0 ? "-" : "+"}¥
              {Math.abs(balance.amount).toLocaleString()}
            </p>
          </div>

          {balance.story && (
            <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              {balance.story}
            </div>
          )}

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">登録日時</dt>
              <dd>
                {new Date(balance.created_at).toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
