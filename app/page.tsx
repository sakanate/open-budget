import Dashboard from "@/app/components/Dashboard";
import { getUser } from "@/app/auth/server";
import client from "@/lib/api/client";

export default async function Page() {
  const { data: user } = await getUser();
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
