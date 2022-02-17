-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "withAlert" BOOLEAN NOT NULL DEFAULT false,
    "withNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fromJobId" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_fromJobId_fkey" FOREIGN KEY ("fromJobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
