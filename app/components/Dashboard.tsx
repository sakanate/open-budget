"use client";

import { useState, useActionState, useEffect } from "react";
import Link from "next/link";

import {
  insertBalance,
  type BalanceResponse,
  type InsertBalanceState,
} from "@/app/actions/insertBalance";
import { useUser } from "@/app/auth/UserProvider";

export default function Dashboard({ initBalance }: { initBalance: BalanceResponse[] }) {
  const { username } = useUser();
  const [balance, setBalance] = useState(initBalance);

  const handleAddBalance = (item: BalanceResponse) => {
    setBalance((prev) => [item, ...prev]);
  };

  const total = balance.reduce((acc, current) => acc + current.amount, 0);

  return (
    <div>
      <p>{username}</p>
      <p>{total} 円</p>

      <SearchBar />
      <BudgetList balance={balance} />

      <AddBalanceForm onSubmit={handleAddBalance} />
    </div>
  );
}

function SearchBar() {
  // TODO: 検索バーの入力でdescriptionをLIKEで検索するよう実装する
  return (
    <div>
      <input type="text" placeholder="検索" />
    </div>
  );
}

function BudgetList({ balance }: { balance: BalanceResponse[] }) {
  return (
    <div>
      {balance.length === 0 && <p>データがありません</p>}
      {balance.map((item) => (
        <Link href={`/d/${item.id}`} className="flex" key={item.id}>
          <span>{item.category}</span>
          <span>{item.description}</span>
          <span>{item.amount} 円</span>
        </Link>
      ))}
    </div>
  );
}

function AddBalanceForm({ onSubmit }: { onSubmit?: (item: BalanceResponse) => void }) {
  const [state, formAction] = useActionState(insertBalance, {
    error: null,
  } as InsertBalanceState);

  useEffect(() => {
    if (!state.data) return;
    onSubmit?.(state.data);
  }, [state.data, onSubmit]);

  return (
    <form action={formAction} className="fixed bottom-0 left-0 right-0 flex">
      <input name="category" type="text" placeholder="カテゴリ" />
      <input name="description" type="text" placeholder="摘要" />
      <input name="amount" type="number" placeholder="金額" />
      <button>追加</button>
    </form>
  );
}
