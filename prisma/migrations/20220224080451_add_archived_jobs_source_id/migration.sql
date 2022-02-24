/*
  Warnings:

  - A unique constraint covering the columns `[sourceId]` on the table `ArchivedJob` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceId` to the `ArchivedJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArchivedJob" ADD COLUMN     "sourceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ArchivedJob_sourceId_key" ON "ArchivedJob"("sourceId");
