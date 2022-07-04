/*
  Warnings:

  - A unique constraint covering the columns `[logoFileId]` on the table `Institution` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Institution" ADD COLUMN     "logoFileId" TEXT,
ADD COLUMN     "url" TEXT;

-- CreateTable
CREATE TABLE "InstitutionPage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "institutionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "InstitutionPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionPage_institutionId_key" ON "InstitutionPage"("institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_logoFileId_key" ON "Institution"("logoFileId");

-- AddForeignKey
ALTER TABLE "InstitutionPage" ADD CONSTRAINT "InstitutionPage_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institution" ADD CONSTRAINT "Institution_logoFileId_fkey" FOREIGN KEY ("logoFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
