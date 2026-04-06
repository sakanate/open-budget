"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser, RegisterUserState } from "@/app/actions/signup";

export default function Page() {
  const router = useRouter();
  const [state, formAction] = useActionState(registerUser, {
    error: null,
  } as RegisterUserState);

  useEffect(() => {
    if (!state.data) return;
    console.log(
      `user registered: username=${state.data.username}, anonId=${state.data.anonId}`,
    );
    router.push("/");
  }, [state.data, router]);

  return (
    <main>
      <h1>ユーザー名を設定</h1>
      <form action={formAction}>
        {state.error && <p>{state.error}</p>}
        <input type="text" name="username" placeholder="ユーザー名を入力" />
        <button type="submit">登録</button>
      </form>
    </main>
  );
}
