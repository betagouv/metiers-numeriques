/*
  Warnings:

  - A unique constraint covering the columns `[sourceId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceId` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "sourceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Address_sourceId_key" ON "Address"("sourceId");
