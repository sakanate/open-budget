import { redirect } from "next/navigation";

import Dashboard from "@/app/components/Dashboard";
import { getUser } from "@/app/auth/server";
import client from "@/lib/api/client";

export default async function Page() {
  const { data: user, error } = await getUser();

  if (error) {
    console.error(error);
    redirect("/signup");
  }
  if (!user) {
    console.log("No user found");
    redirect("/signup");
  }

  const { data: balance } = user
    ? await client.GET("/users/{user_id}/balances", {
        params: { path: { user_id: user.anonId } },
      })
    : { data: [] };

  return (
    <main>
      <Dashboard initBalance={balance ?? []} />
    </main>
  );
}
