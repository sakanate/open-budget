-- CreateTable
CREATE TABLE "Balance" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "story" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Balance_owner_id_idx" ON "Balance"("owner_id");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
