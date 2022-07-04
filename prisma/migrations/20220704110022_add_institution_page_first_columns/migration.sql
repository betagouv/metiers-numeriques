/*
  Warnings:

  - A unique constraint covering the columns `[logoFileId]` on the table `Institution` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Institution" ADD COLUMN     "description" TEXT,
ADD COLUMN     "logoFileId" TEXT,
ADD COLUMN     "pageTitle" TEXT,
ADD COLUMN     "url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Institution_logoFileId_key" ON "Institution"("logoFileId");

-- AddForeignKey
ALTER TABLE "Institution" ADD CONSTRAINT "Institution_logoFileId_fkey" FOREIGN KEY ("logoFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
