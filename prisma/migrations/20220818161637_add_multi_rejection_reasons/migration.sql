/*
  Warnings:

  - You are about to drop the column `rejectionReason` on the `JobApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "rejectionReason",
ADD COLUMN     "rejectionReasons" TEXT[];
