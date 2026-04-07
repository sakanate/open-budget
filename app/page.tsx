import Dashboard from "@/app/components/Dashboard";
import { getUser } from "@/app/auth/server";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const { data: user } = await getUser();
  const balance = await prisma.balance.findMany({
    where: { owner_id: user?.anonId },
    orderBy: { created_at: "desc" },
  });

  return (
    <main>
      <Dashboard initBalance={balance} />
    </main>
  );
}
