-- CreateTable
CREATE TABLE "ArchivedJob" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "missionDescription" TEXT NOT NULL,
    "profileDescription" TEXT,
    "recruiterName" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "source" "JobSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "professionId" TEXT NOT NULL,

    CONSTRAINT "ArchivedJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArchivedJob_slug_key" ON "ArchivedJob"("slug");

-- AddForeignKey
ALTER TABLE "ArchivedJob" ADD CONSTRAINT "ArchivedJob_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
