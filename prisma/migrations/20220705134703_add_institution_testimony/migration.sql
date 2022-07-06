-- CreateTable
CREATE TABLE "Testimony" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "avatarFileId" TEXT,
    "testimony" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,

    CONSTRAINT "Testimony_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Testimony_avatarFileId_key" ON "Testimony"("avatarFileId");

-- AddForeignKey
ALTER TABLE "Testimony" ADD CONSTRAINT "Testimony_avatarFileId_fkey" FOREIGN KEY ("avatarFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimony" ADD CONSTRAINT "Testimony_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
